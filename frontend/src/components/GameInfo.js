// src/components/GameInfo.js

import React from 'react';

const GameInfo = ({ playerPower, playerCount }) => {
  return (
    <div className="player-info">
      <h3>Player Controls</h3>
      <ul>
        <li>W / w: Move Up</li>
        <li>A / a: Move Left</li>
        <li>S / s: Move Down</li>
        <li>D / d: Move Right</li>
        <li>F / f: Fire</li>
      </ul>

      <div>
        <h4>Player Power: {playerPower}</h4>
        <h4>Number of Players: {playerCount}</h4>
      </div>
    </div>
  );
};

export default GameInfo;
