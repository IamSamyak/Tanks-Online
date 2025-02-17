// src/components/Game.js

import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import Player from './Player';
import './Game.css';
import Enemy from './Enemy';
import { spwanBonus } from '../utils/spwan'; // Import the spawnBonus function
import { tileMapping } from '../constants/game-constants'; 
import GameInfo from './GameInfo'; // Import GameInfo component

const NUM_ENEMIES = 2;

const Game = () => {
  const [levelMap, setLevelMap] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ col: 9, row: 21, direction: 'up', color: 'blue' });
  const [playerPower, setPlayerPower] = useState(3); // Dummy value for player power

  const loadLevel = async (levelNumber) => {
    try {
      const response = await fetch(`/levels/${levelNumber}.txt`);
      const text = await response.text();
      const rows = text.split('\n').filter(row => row.trim().length > 0);
      const maxLength = Math.max(...rows.map(row => row.length));
      const normalizedRows = rows.map(row => row.padEnd(maxLength, '.').split(''));
      const tiles = [];
      const emptyTiles = [];

      normalizedRows.forEach((row, rowIndex) => {
        const tileRow = [];
        row.forEach((char, colIndex) => {
          if (char === '.') {
            emptyTiles.push({ col: colIndex, row: rowIndex });
          }
          tileRow.push(tileMapping[char] || 'empty');
        });
        tiles.push(tileRow);
      });

      // Set enemies at random positions
      const tempEnemies = [];
      for (let i = 0; i < NUM_ENEMIES; i++) {
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const position = emptyTiles[randomIndex];
        tempEnemies.push({
          id: `enemy_${i}`,
          type: 'A',
          col: position.col,
          row: position.row,
          direction: 'up'
        });
        emptyTiles.splice(randomIndex, 1); // Remove the occupied tile from the list
      }

      setLevelMap(tiles);
      setEnemies(tempEnemies);
      spwanBonus(emptyTiles, setBonus); // Initial bonus spawn
    } catch (error) {
      console.error('Failed to load level:', error);
    }
  };

  const updateEnemyPosition = (id, newPosition) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) =>
        enemy.id === id ? { ...enemy, col: newPosition.col, row: newPosition.row } : enemy
      )
    );
  };

  useEffect(() => {
    loadLevel(1);
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        {levelMap.map((row, rowIndex) => (
          <div className="game-row" key={rowIndex}>
            {row.map((tile, tileIndex) => (
              <Tile key={tileIndex} type={tile} />
            ))}
          </div>
        ))}

        <Tile
          type={'base'}
          style={{
            position: 'absolute',
            left: `${12 * 32}px`,
            top: `${24 * 32}px`,
            width: '64px',
            height: '64px',
          }}
        />

        {/* Pass playerPosition state to Player component */}
        <Player
          levelMap={levelMap}
          setLevelMap={setLevelMap}
          playerPosition={playerPosition}
          setPlayerPosition={setPlayerPosition}
          bonus={bonus}
        />

        {/* Loop through enemies and render each one */}
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            initialPosition={{ col: enemy.col, row: enemy.row, direction: enemy.direction }}
            levelMap={levelMap}
            setLevelMap={setLevelMap}
            type={enemy.type}
            target={playerPosition}
            updatePosition={updateEnemyPosition}
          />
        ))}

        {/* Render bonus if exists */}
        {bonus && (
          <Tile
            type={bonus.type}
            style={{
              position: 'absolute',
              left: `${bonus.col * 32}px`,
              top: `${bonus.row * 32}px`,
              width: '32px',
              height: '32px',
              animation: 'blink 2.5s infinite'
            }}
          />
        )}
      </div>
      
      <GameInfo playerPower={playerPower} />
    </div>
  );
};

export default Game;
