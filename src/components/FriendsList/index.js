import React from "react";
import "./FriendsList.css"

function FriendsList({ friends, onAcceptRequest, onRejectRequest }) {
  return (
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
  );
}

export default FriendsList;
