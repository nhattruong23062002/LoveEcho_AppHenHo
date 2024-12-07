import React, { useState, useEffect } from "react";
import { Button, notification, Radio } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Event.css";
import Layout from "../../layout/layout";
import axios from "axios";
import { API_URL } from "../../config/configUrl";
import { getUserFromLocalStorage } from "../../utils/getUserFromLocalStorage";
import CreateEventModal from "../../components/ModalEvent";
import MiniGame from "../../components/MiniGame";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [options, setOptions] = useState([""]);
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({}); // state cho selectedOption theo từng sự kiện

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
          message: "Error loading event",
          description:
            "Unable to load events from server. Please try again later.",
        });
      });
  }, []);

  const showModal = () => {
    setShowCreateEventModal(true);
  };

  const handleCancel = () => {
    setShowCreateEventModal(false);
  };

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const updateEventList = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleVote = async (eventId, optionId) => {
    try {
      const updatedEvents = events.map((event) => {
        if (event.id === eventId) {
          const updatedOptions = event.options.map((option) => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          return { ...event, options: updatedOptions, voted: true };
        }
        return event;
      });

      setEvents(updatedEvents);

      await axios.patch(`${API_URL}/events/${eventId}`, {
        options: updatedEvents.find((event) => event.id === eventId).options,
      });

      notification.success({
        message: "Vote successful!",
        description: `You voted for the option "${optionId}".`,
      });
    } catch (error) {
      console.error("Error updating vote:", error);
      notification.error({
        message: "Error while voting",
        description: "An error occurred while voting. Please try again.",
      });
    }
  };

  const checkForTie = (options) => {
    if (options.length > 1) {
      const voteCount = options.map((option) => option.votes);
      return voteCount.every((vote, i, arr) => vote === arr[0]);
    }
    return false;
  };

  const handleOptionChange = (eventId, selectedOption) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [eventId]: selectedOption,
    }));
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

        <CreateEventModal
          visible={showCreateEventModal}
          onCancel={handleCancel}
          onCreate={handleCreateEvent}
          friendsList={friendsList}
          user={user}
          options={options}
          setOptions={setOptions}
          selectedFriends={selectedFriends}
          setSelectedFriends={setSelectedFriends}
        />

        <h3>List of upcoming events</h3>
        <div className="event-list">
          {events?.map((event) => {
            const isTie = checkForTie(event.options);

            const disableRadioButtons = event.options.some(option => option.status === "selected");

            const showMiniGame = !event.options.some(option => option.status === "selected");

            return (
              <div key={event.id} className="event-item">
                <h4>{event.name}</h4>
                <p>
                  Participants:{" "}
                  {event.friendsDetails?.length > 0
                    ? event.friendsDetails.map((e) => e.username).join(", ")
                    : "No participants yet"}
                </p>
                <div className="options">
                  {event.options?.map((option) => (
                    <div key={option.id} style={{ marginBottom: "8px" }}>
                      <Radio
                        value={option.id}
                        onChange={(e) => handleOptionChange(event.id, e.target.value)}
                        disabled={disableRadioButtons || event.voted || event.options.length === 1}
                        checked={selectedOptions[event.id] === option.id || option.status === "selected"}
                      >
                        {option.name} (Votes: {option.votes})
                      </Radio>
                    </div>
                  ))}

                  {isTie && showMiniGame && <MiniGame options={event.options} eventId={event.id} updateEventList={updateEventList}/>}

                  {event.options?.length > 1 && !event.voted && (
                    <Button
                      type="primary"
                      onClick={() => handleVote(event.id, selectedOptions[event.id])}
                      disabled={!selectedOptions[event.id]}
                    >
                      Vote
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;
