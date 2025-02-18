// src/context/GameContext.js
import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [levelMap, setLevelMap] = useState([]);
  const [enemiesInfo, setEnemiesInfo] = useState([
    {
      id: `enemy_initial`,
      type: 'A',
      col: [0, 12, 24][Math.floor(Math.random() * 3)],
      row: 0,
      direction: 'down',
      health: 2,
    }
  ]);
  const [bonus, setBonus] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({ col: 9, row: 24, direction: 'up', color: 'blue', health: 2 });
  const [playerPower, setPlayerPower] = useState(3);

  return (
    <GameContext.Provider value={{
      levelMap, setLevelMap,
      enemiesInfo, setEnemiesInfo,
      bonus, setBonus,
      playerInfo, setPlayerInfo,
      playerPower, setPlayerPower
    }}>
      {children}
    </GameContext.Provider>
  );
};
