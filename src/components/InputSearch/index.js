import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../config/configUrl";
import { getUserFromLocalStorage } from "../../utils/getUserFromLocalStorage";

const SearchInput = ({ setFriendsList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = getUserFromLocalStorage();
  const friendIds = currentUser.friends;

  const handleSearch = async () => {
    const response = await axios.get(`${API_URL}/users`);
    if (!searchQuery) {
      try {
        const friends = response.data.filter((user) =>
          friendIds.includes(Number(user.id))
        );
        setFriendsList(friends);
      } catch (error) {
        console.error("Error fetching all users:", error);
        notification.error({
          message: "User Load Error",
          description: "Failed to load user list. Please try again..",
        });
      }
      return;
    }

    try {
      const filteredUsers = response.data
        .filter((user) => friendIds.includes(Number(user.id)))
        .filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

      setFriendsList(filteredUsers);

      if (filteredUsers.length === 0) {
        notification.warning({
          message: "No results found",
          description: "No users matched the search keyword.",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      notification.error({
        message: "Search error",
        description: "Unable to find friends. Please try again.",
      });
    }
  };

  return (
    <div className="search-input">
      <Input
        placeholder="Find friends by username or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: 300 }}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        style={{ marginLeft: 8 }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchInput;
