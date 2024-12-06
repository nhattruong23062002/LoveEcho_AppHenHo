import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Select,
  notification,
  Checkbox,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "./Event.css";
import Layout from "../../layout/layout";
import axios from "axios";
import { API_URL } from "../../config/configUrl";
import { getUserFromLocalStorage } from "../../utils/getUserFromLocalStorage";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventForm] = Form.useForm();
  const [options, setOptions] = useState([""]);
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const userFromStorage = getUserFromLocalStorage();
    setUser(userFromStorage);

    if (userFromStorage) {
      const friendsIds = userFromStorage.friends || [];
      axios
        .get(`${API_URL}/users`)
        .then((response) => {
          const friendsDetails = response.data.filter((user) =>
            friendsIds.includes(Number(user.id))
          );
          setFriendsList(friendsDetails);
        })
        .catch((error) => {
          console.error("Error fetching friends details:", error);
        });
    }
    axios
      .get(`${API_URL}/events`)
      .then((response) => {
        const eventsData = response.data;
        const filteredEvents = eventsData.filter((event) =>
          event.friends.includes(Number(userFromStorage.id))
        );
        const updatedEvents = filteredEvents.map((event) => {
          const friendsInEvent = event.friends || [];
          return axios
            .get(`${API_URL}/users`)
            .then((userResponse) => {
              const friendsDetails = userResponse.data.filter((user) =>
                friendsInEvent.includes(Number(user.id))
              );

              return { ...event, friendsDetails };
            })
            .catch((error) => {
              console.error("Error fetching friends details:", error);
              return { ...event, friendsDetails: [] };
            });
        });

        Promise.all(updatedEvents).then((eventsWithFriends) => {
          setEvents(eventsWithFriends);
        });
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        notification.error({
          message: "Lỗi khi tải sự kiện",
          description:
            "Không thể tải các sự kiện từ server. Vui lòng thử lại sau.",
        });
      });
  }, []);

  const showModal = () => {
    setShowCreateEventModal(true);
  };

  const handleCancel = () => {
    setShowCreateEventModal(false);
  };

  const handleCreateEvent = (values) => {
    const newEvent = {
      id: Math.random().toString(36).substring(7),
      name: values.name,
      options: options.map((option, index) => ({
        id: `option-${index}`,
        name: option,
        status: "pending",
        votes: 0,
      })),
      friends: [...selectedFriends, Number(user.id)],
    };
    axios
      .post(`${API_URL}/events`, newEvent)
      .then((response) => {
        setEvents([...events, response.data]);
        notification.success({
          message: "Sự kiện đã được tạo!",
          description: `Sự kiện "${values.name}" đã được tạo thành công.`,
        });
        setShowCreateEventModal(false);
        eventForm.resetFields();
        setOptions([""]);
        setSelectedFriends([]);
      })
      .catch((error) => {
        notification.error({
          message: "Tạo sự kiện thất bại",
          description: "Đã có lỗi xảy ra khi tạo sự kiện. Vui lòng thử lại!",
        });
      });
  };

  const handleAddOption = () => {
    if (options.length < 3) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, idx) => idx !== index);
    setOptions(newOptions);
  };

  const handleFriendChange = (value) => {
    setSelectedFriends(value);
  };

  const handleVote = (eventId, optionId) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const updatedOptions = event.options.map((option) => {
          if (option.id === optionId) {
            return { ...option, status: "pending", votes: option.votes + 1 };
          }
          return option;
        });
        return { ...event, options: updatedOptions };
      }
      return event;
    });
    setEvents(updatedEvents);
    notification.success({
      message: "Bình chọn thành công!",
      description: `Bạn đã bình chọn cho phương án "${optionId}".`,
    });
  };

  return (
    <Layout>
      <div className="event-page">
        <h2>Trang sự kiện</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="create-event-button"
        >
          Create an event calendar
        </Button>

        <Modal
          title="Create new event"
          visible={showCreateEventModal}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={eventForm} layout="vertical" onFinish={handleCreateEvent}>
            <Form.Item
              label="Event Name"
              name="name"
              rules={[{ required: true, message: "Please enter event name!" }]}
            >
              <Input placeholder="Enter event name" />
            </Form.Item>

            <Form.Item label="Phương án (Options)" name="options">
              <div>
                {options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      value={option}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => handleRemoveOption(index)}
                      style={{ marginLeft: 8, color: "red" }}
                    />
                  </div>
                ))}
                {options.length < 3 && (
                  <Button
                    className="add-option"
                    type="link"
                    onClick={handleAddOption}
                  >
                    Thêm phương án
                  </Button>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label="Chọn bạn bè tham gia"
              name="friends"
              rules={[
                {
                  required: true,
                  message: "Please select friends to join the event!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select friends"
                value={selectedFriends}
                onChange={handleFriendChange}
                options={friendsList.map((friend) => ({
                  label: friend.username,
                  value: Number(friend.id),
                }))}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Create event
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <h3>List of upcoming events</h3>
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id} className="event-item">
              <h4>{event.name}</h4>
              <p>
                Participants:{" "}
                {event.friendsDetails
                  .map((e) => {
                    return e.username;
                  })
                  .join(", ")}
              </p>
              <div className="options">
                {event.options.map((option) => (
                  <div key={option.id} style={{ marginBottom: "8px" }}>
                    <Checkbox
                      value={option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      disabled={event.options.length === 1}
                    >
                      {option.name} (Votes: {option.votes})
                    </Checkbox>
                  </div>
                ))}
                {event.options.length > 1 && (
                  <Button
                    type="primary"
                    onClick={() => handleVote(event.id, selectedOption)}
                    disabled={!selectedOption}
                  >
                    Bình chọn
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;
