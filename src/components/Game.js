import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import Player from './Player';
import Enemies from './Enemies';
import './Game.css';
import Enemy from './Enemy';

const tileMapping = {
  '.': 'empty',
  '#': 'brick',
  '@': 'stone',
  '%': 'bush',
  '~': 'water',
  '-': 'ice',
};

const NUM_ENEMIES = 3;
const bonusTypes = ['grenade', 'helmet', 'clock', 'shovel', 'tank', 'star', 'gun', 'boat'];

const Game = () => {
  const [levelMap, setLevelMap] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [bonus, setBonus] = useState(null);

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

      const tempEnemies = [];
      for (let i = 0; i < NUM_ENEMIES; i++) {
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const position = emptyTiles[randomIndex];
        tempEnemies.push({
          type: 'A',
          col: position.col,
          row: position.row,
          direction: 'up'
        });
        emptyTiles.splice(randomIndex, 1);
      }

      setLevelMap(tiles);
      setEnemies(tempEnemies);
      spawnBonus(emptyTiles); // Initial bonus spawn
    } catch (error) {
      console.error('Failed to load level:', error);
    }
  };

  const spawnBonus = (emptyTiles) => {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const position = emptyTiles[randomIndex];
    const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];

    setBonus({
      type: `bonus_${randomBonusType}`,
      col: position.col,
      row: position.row,
    });

    setTimeout(()=>{
     setBonus(null);
     setTimeout(()=>{
      spawnBonus(emptyTiles);
     },10000)
    },5000)
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

        <Player
          levelMap={levelMap}
          setLevelMap={setLevelMap}
          initialPosition={{ type: 'A', col: 9, row: 21, color: 'blue', direction: 'up' }}
          bonus={bonus} 
        />

        <Enemy levelMap={levelMap}
          setLevelMap={setLevelMap}
          initialPosition={{ type: 'A', col: 0, row: 0, color: 'blue', direction: 'right' }}/>

        {/* <Enemies enemies={enemies} setEnemies={setEnemies} levelMap={levelMap} /> */}

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

      <div className="player-info">
        <h3>Player Controls</h3>
        <ul>
          <li>W / w: Move Up</li>
          <li>A / a: Move Left</li>
          <li>S / s: Move Down</li>
          <li>D / d: Move Right</li>
          <li>F / f: Fire</li>
        </ul>
      </div>
    </div>
  );
};

export default Game;
