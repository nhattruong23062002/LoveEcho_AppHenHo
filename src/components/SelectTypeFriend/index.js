import React from "react";
import "./SelectTypeFriend.css"; 

const SelectTypeFriend = ({ isVisible, onClose, onSelectFriendType }) => {
  if (!isVisible) return null; 

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Select friend type</h3>
        <ul>
          <li onClick={() => onSelectFriendType("bestfiend")}>Best friend</li>
          <li onClick={() => onSelectFriendType("colleagues")}>Colleague</li>
          <li onClick={() => onSelectFriendType("social")}>Social friend</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SelectTypeFriend;
