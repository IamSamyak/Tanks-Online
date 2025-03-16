// Game.js
import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import Player from './Player';
import './Game.css';
import Enemy from './Enemy';
import { spwanBonus, spawnEnemy } from '../utils/spwan';
import { tileMapping } from '../constants/game-constants';
import GameInfo from './GameInfo';
import { handleBonusCollision } from '../utils/bonusHandler'; // Import the modularized function

const MAX_ENEMIES = 1;
const ENEMY_SPAWN_INTERVAL = 7000; // 7 seconds

const Game = () => {
  const [levelMap, setLevelMap] = useState([]);
  const [enemiesInfo, setEnemiesInfo] = useState([
    {
      id: `enemy_initial_${Date.now()}`,
      type: 'A',
      col: [0, 12, 24][Math.floor(Math.random() * 3)], // Random column: 0, 12, or 24
      row: 0, // Fixed row 0
      direction: 'down',
      health: 2,
      frozen: false,
      boatBonus: false
    },
  ]);
  const [bonus, setBonus] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({ col: 9, row: 24, direction: 'up', color: 'blue', health: 2, lives: 1, star: 3, boatBonus: false });
  const [baseDestroyed, setBaseDestroyed] = useState(false);

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
      setLevelMap(tiles);
      spwanBonus(emptyTiles, setBonus);
    } catch (error) {
      console.error('Failed to load level:', error);
    }
  };

  const updateEnemyPosition = (id, newPosition) => {    
    setEnemiesInfo((prevEnemies) =>
      prevEnemies.map((enemy) =>
        enemy.id === id ? { ...enemy, col: newPosition.col, row: newPosition.row } : enemy
      )
    );
  };

  useEffect(() => {
    loadLevel(10);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      spawnEnemy(enemiesInfo, setEnemiesInfo, MAX_ENEMIES);
    }, ENEMY_SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [enemiesInfo]);

  useEffect(() => {
    if (bonus) {
      handleBonusCollision(bonus, playerInfo, setEnemiesInfo, setPlayerInfo, setLevelMap, setBonus);
    }
  }, [bonus, playerInfo]);

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

        {enemiesInfo && levelMap && <Player
          levelMap={levelMap}
          setLevelMap={setLevelMap}
          playerInfo={playerInfo}
          setPlayerInfo={setPlayerInfo}
          bonus={bonus}
          setBonus={setBonus}
          enemiesInfo={enemiesInfo}
          setEnemiesInfo={setEnemiesInfo}
          setBaseDestroyed={setBaseDestroyed}
        />}

        {enemiesInfo.map((enemy) => (
          <Enemy
            key={enemy.id}
            initialPosition={{id:enemy.id, col: enemy.col, row: enemy.row, direction: enemy.direction }}
            levelMap={levelMap}
            setLevelMap={setLevelMap}
            type={enemy.type}
            target={playerInfo}
            frozen={enemy.frozen}
            updatePosition={updateEnemyPosition}
            setBaseDestroyed={setBaseDestroyed}
          />
        ))}

        {bonus && (
          <Tile
            type={bonus.type}
            style={{
              position: 'absolute',
              left: `${bonus.col * 32}px`,
              top: `${bonus.row * 32}px`,
              width: '32px',
              height: '32px',
              animation: 'blink 2.5s infinite',
            }}
          />
        )}
      </div>

      <GameInfo playerPower={baseDestroyed ? 'destroyed' : 'alive'} />
    </div>
  );
};

export default Game;
