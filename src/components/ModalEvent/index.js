import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../config/configUrl";

const CreateEventModal = ({ visible, onCancel, onCreate, friendsList, user, options, setOptions, selectedFriends, setSelectedFriends }) => {
  const [eventForm] = Form.useForm();

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
        onCreate(response.data); 
        notification.success({
          message: "Event created!",
          description: `Event "${values.name}" was created successfully.`,
        });
        onCancel(); 
        eventForm.resetFields();
        setOptions([""]);
        setSelectedFriends([]);
      })
      .catch((error) => {
        notification.error({
          message: "Create event failed",
          description: "An error occurred while creating the event. Please try again!",
        });
      });
  };

  return (
    <Modal
      title="Create new event"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={eventForm} layout="vertical" onFinish={handleCreateEvent}>
        <Form.Item
          label="Event Name"
          name="name"
          rules={[{ required: true, message: "Please enter an event name!" }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item label="Options" name="options">
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
                  onChange={(e) => handleOptionChange(index, e.target.value)}
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
                Add option
              </Button>
            )}
          </div>
        </Form.Item>

        <Form.Item
          label="Select friends to join"
          name="friends"
          rules={[{ required: true, message: "Choose your friends to join!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Choose friends"
            value={selectedFriends}
            onChange={handleFriendChange}
            options={friendsList.map((friend) => ({
              label: friend.username,
              value: Number(friend.id),
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Create event
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
