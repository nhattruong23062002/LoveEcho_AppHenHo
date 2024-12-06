import React, { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { Button } from "antd";
import Layout from "../../layout/layout";
import "./FriendPage.css";
import { getUserFromLocalStorage } from "../../utils/getUserFromLocalStorage";
import { API_URL } from "../../config/configUrl";

function FriendPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const user = getUserFromLocalStorage();

  useEffect(() => {
    if (user) {
      const storedFriends = user.friends || [];
      const storedFriendRequests = user.friendRequests || [];

      const friendsIds = storedFriends.map((id) => id.toString());
      const friendRequestsIds = storedFriendRequests
        .filter((request) => request.status === "pending")
        .map((request) => request.fromUserId.toString());

      axios
        .get(`${API_URL}/users`)
        .then((response) => {
          const friendsDetails = response.data.filter((user) =>
            friendsIds.includes(user.id)
          );
          const friendsWithType = friendsDetails.map((friend) => {
            let typeFriend = "";

            if (
              friend.friendGroups.closeFriends &&
              friend.friendGroups.closeFriends.includes(Number(user.id))
            ) {
              typeFriend = "Best Friend";
            } else if (
              friend.friendGroups.colleagues &&
              friend.friendGroups.colleagues.includes(Number(user.id))
            ) {
              typeFriend = "Colleague";
            } else if (
              friend.friendGroups.social &&
              friend.friendGroups.social.includes(Number(user.id))
            ) {
              typeFriend = "Social Friend";
            }

            return { ...friend, typeFriend };
          });
          setFriends(friendsWithType);
        })
        .catch((error) =>
          console.error("Error fetching friends details:", error)
        );

      axios
        .get(`${API_URL}/users`)
        .then((response) => {
          const friendRequestsDetails = response.data.filter((user) =>
            friendRequestsIds.includes(user.id)
          );
          setFriendRequests(friendRequestsDetails);
        })
        .catch((error) =>
          console.error("Error fetching friend requests details:", error)
        );
    }
  }, []);

  const handleAcceptRequest = (request) => {
    const userId = Number(user.id);
    const requestId = Number(request.id);
  
    const userFriendRequest = user.friendRequests.find(
      (r) => r.fromUserId === requestId
    );
  
    const friendType = userFriendRequest ? userFriendRequest.friendType : "";
  
    const validFriendType = friendType && (friendType === "closeFriends" || friendType === "colleagues" || friendType === "social") ? friendType : "others";
  
    const updatedUserFriendGroups = {
      ...user.friendGroups,
      [validFriendType]: [...(user.friendGroups[validFriendType] || []), requestId],
    };
  
    const updatedRequestFriendGroups = {
      ...request.friendGroups,
      [validFriendType]: [...(request.friendGroups[validFriendType] || []), userId],
    };
  
    const updateUserRequest = axios.patch(`${API_URL}/users/${userId}`, {
      friendRequests: user.friendRequests.map((r) =>
        r.fromUserId === requestId ? { ...r, status: "complete" } : r
      ),
      friends: [...user.friends, requestId],
      friendGroups: updatedUserFriendGroups, 
    });
  
    const updateFriendRequest = axios.patch(`${API_URL}/users/${requestId}`, {
      friends: [...request.friends, userId],
      friendGroups: updatedRequestFriendGroups, 
    });
  
    Promise.all([updateUserRequest, updateFriendRequest])
      .then(() => {
        const updatedUser = {
          ...user,
          friendRequests: user.friendRequests.map((r) =>
            r.fromUserId === requestId ? { ...r, status: "complete" } : r
          ),
          friends: [...user.friends, requestId],
          friendGroups: updatedUserFriendGroups, 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        notification.success({
          message: "Friend request accepted!",
          description: `${request.username} has become your friend.`,
          placement: "topRight",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Error processing friend request",
          description: "There was an error accepting the friend request.",
          placement: "topRight",
        });
      });
  };
  

  const handleRejectRequest = (request) => {
    const userId = Number(user.id);
    const requestId = Number(request.id);
    axios
      .patch(`${API_URL}/users/${userId}`, {
        friendRequests: user.friendRequests.map((r) =>
          r.fromUserId === requestId ? { ...r, status: "cancel" } : r
        ),
      })
      .then((response) => {
        const updatedUser = {
          ...user,
          friendRequests: user.friendRequests.map((r) =>
            r.fromUserId === requestId ? { ...r, status: "cancel" } : r
          ),
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        notification.info({
          message: "Friend request declined",
          description: `${request.username} was rejected as a friend.`,
          placement: "topRight",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Error when rejecting friend request",
          description: "An error occurred while rejecting the friend request.",
          placement: "topRight",
        });
      });
  };

  return (
    <Layout>
      <div className="friend-page">
        <h2>Friend Request</h2>
        <div className="friends-list">
          {friendRequests.length === 0 ? (
            <p>No friend requests yet.</p>
          ) : (
            friendRequests.map((request) => (
              <div key={request.id} className="friend-item">
                <img
                  className="avatar-friend"
                  src={request.image}
                  alt={request.username}
                />
                <div className="friend-info">
                  <p className="friend-name">{request.username}</p>
                  <p className="friend-address">{request.address}</p>
                </div>
                <div className="wrapper-button">
                  <Button
                    className="button-accept"
                    onClick={() => handleAcceptRequest(request)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="button-refuse"
                    onClick={() => handleRejectRequest(request)}
                  >
                    Refuse
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <h2>Friends List</h2>
        <div className="friends-list">
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            friends.map((friend) => (
              <div key={friend.id} className="friend-item">
                <img
                  className="avatar-friend"
                  src={friend.image}
                  alt={friend.username}
                />
                <div className="friend-info">
                  <p className="friend-name">{friend.username}</p>
                  <p className="friend-address">{friend.address}</p>
                </div>
                <i className="type-friend">{friend.typeFriend}</i>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default FriendPage;
