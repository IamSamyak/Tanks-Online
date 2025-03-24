import React, { useState } from "react";
import "./Home.css";
import { v4 as uuidv4 } from "uuid"; // Generates unique game codes

const Home = ({ setGameCode }) => {
  const [inputGameCode, setInputGameCode] = useState("");

  const handleCreateGame = () => {
    const newGameCode = uuidv4().slice(0, 6).toUpperCase(); // Generate 6-character game code
    setGameCode(newGameCode);
  };

  const handleJoinGame = () => {
    if (inputGameCode.trim().length === 6) {
      setGameCode(inputGameCode.trim().toUpperCase());
    } else {
      alert("Enter a valid 6-character game code.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="game-title">Welcome to Tanks Game</h1>
      <div className="buttons-container">
        <button className="btn create-btn" onClick={handleCreateGame}>
          Create New Game
        </button>
        <div className="join-game">
          <input
            type="text"
            placeholder="Enter Game Code"
            value={inputGameCode}
            onChange={(e) => setInputGameCode(e.target.value)}
          />
          <button className="btn join-btn" onClick={handleJoinGame}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
