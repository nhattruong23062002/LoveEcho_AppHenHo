import React, { useState } from 'react';
import { notification } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/configUrl';
import "./Minigame.css";

const MiniGame = ({ options, eventId, updateEventList }) => {
  const [buttonText, setButtonText] = useState("Minigame Random");
  const [isRunning, setIsRunning] = useState(false);

  const randomOption = () => {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const handleClick = () => {
    if (isRunning) return;

    setIsRunning(true);
    setButtonText("...");

    let interval = setInterval(() => {
      setButtonText(randomOption().name);
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      const selectedOption = randomOption();
      setButtonText(selectedOption.name);
      setIsRunning(false);

      try {
        const response = await axios.patch(`${API_URL}/events/${eventId}`, {
          options: options.map(option =>
            option.id === selectedOption.id
              ? { ...option, status: 'selected' }
              : option
          ),
        });

        notification.success({
          message: "Random success!",
          description: `The event will take place at "${selectedOption.name}".`,
        });

        updateEventList(response.data);
        
      } catch (error) {
        console.error("Error updating option status:", error);
        notification.error({
          message: "Error!",
          description: "There was an error updating the option status. Please try again.",
        });
      }
    }, 2500);
  };

  return (
    <div className="mini-game-container">
      <span className="mini-game-button" onClick={handleClick}>
        {buttonText}
      </span>
    </div>
  );
};

export default MiniGame;
