// src/pages/FriendPage/FriendPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { Button } from "antd";
import Layout from "../../layout/layout";
import "./FriendPage.css";

function FriendPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const loggedInUser = JSON.parse(user);
      setCurrentUser(loggedInUser);

      const storedFriends = loggedInUser.friends || [];
      const storedFriendRequests = loggedInUser.friendRequests || [];

      const friendsIds = storedFriends.map((id) => id.toString());
      const friendRequestsIds = storedFriendRequests
        .filter((request) => request.status === "pending")
        .map((request) => request.fromUserId.toString());

      if (friendsIds.length > 0) {
        axios
          .get("http://localhost:5000/users")
          .then((response) => {
            const friendsDetails = response.data.filter((user) =>
              friendsIds.includes(user.id)
            );
            setFriends(friendsDetails);
          })
          .catch((error) =>
            console.error("Error fetching friends details:", error)
          );
      }
      if (friendRequestsIds.length > 0) {
        axios
          .get("http://localhost:5000/users")
          .then((response) => {
            const friendRequestsDetails = response.data.filter((user) =>
              friendRequestsIds.includes(user.id)
            );
            console.log(friendRequestsDetails);
            setFriendRequests(friendRequestsDetails);
          })
          .catch((error) =>
            console.error("Error fetching friend requests details:", error)
          );
      }
    }
  }, []);

  const handleAcceptRequest = (request) => {
    const updatedRequest = { ...request, status: "accepted" };

    axios
      .patch(`http://localhost:5000/users/${request.fromUserId}`, {
        friendRequests: request.fromUserId.friendRequests.map((r) =>
          r.id === request.id ? updatedRequest : r
        ),
        friends: [...currentUser.friends, request.fromUserId], // Thêm bạn vào danh sách bạn bè
      })
      .then((response) => {
        // Cập nhật lại danh sách bạn bè của người nhận
        setFriendRequests(friendRequests.filter((r) => r.id !== request.id));
        setFriends([...friends, request.fromUserId]);

        notification.success({
          message: "Yêu cầu kết bạn đã được chấp nhận!",
          description: `${request.username} đã trở thành bạn của bạn.`,
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
        notification.error({
          message: "Lỗi khi chấp nhận yêu cầu kết bạn",
          description: "Đã có lỗi xảy ra khi bạn chấp nhận yêu cầu kết bạn.",
          placement: "topRight",
        });
      });
  };

  const handleRejectRequest = (request) => {
    axios
      .patch(`http://localhost:5000/users/${request.fromUserId}`, {
        friendRequests: request.fromUserId.friendRequests.filter(
          (r) => r.id !== request.id
        ),
      })
      .then((response) => {
        setFriendRequests(friendRequests.filter((r) => r.id !== request.id));

        notification.info({
          message: "Yêu cầu kết bạn đã bị từ chối",
          description: `${request.fromUserId} đã bị từ chối kết bạn.`,
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.error("Error rejecting friend request:", error);
        notification.error({
          message: "Lỗi khi từ chối yêu cầu kết bạn",
          description: "Đã có lỗi xảy ra khi bạn từ chối yêu cầu kết bạn.",
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
                <Button className="button-accept" onClick={() => handleAcceptRequest(request)}>
                  Accept
                </Button>
                <Button className="button-refuse" onClick={() => handleRejectRequest(request)}>
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
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default FriendPage;
