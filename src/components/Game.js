import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import './Game.css';

const tileMapping = {
  '.': 'empty',       // Empty field
  '#': 'brick',       // Brick wall
  '@': 'stone',       // Stone wall
  '%': 'bush',        // Bush
  '~': 'water',       // Water
  '-': 'ice',         // Ice
};

// Number of enemies and bonuses to place per level
const NUM_ENEMIES = 3;
const NUM_BONUSES = 2;

// Enemy types
const enemyTypes = ['A', 'B', 'C', 'D'];

// Bonus types
const bonusTypes = ['grenade', 'helmet', 'clock', 'shovel', 'tank', 'star', 'gun', 'boat'];

const Game = () => {
  const [levelMap, setLevelMap] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [player, setPlayer] = useState({ type: 'A', col: 9, row: 21, color: 'blue', direction: 'up' });

  const loadLevel = async (levelNumber) => {
    try {
      const response = await fetch(`/levels/${levelNumber}.txt`);
      const text = await response.text();

      const rows = text
        .split('\n')
        .filter(row => row.trim().length > 0);

      const maxLength = Math.max(...rows.map(row => row.length));
      const normalizedRows = rows.map(row =>
        row
          .padEnd(maxLength, '.')
          .split('')
      );

      const tiles = [];
      const emptyTiles = [];

      // Collect empty tile positions
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

      const isValidSquare = (col, row) => {
        return (
          tiles[row] && tiles[row + 1] &&
          tiles[row][col] === 'empty' && tiles[row][col + 1] === 'empty' &&
          tiles[row + 1][col] === 'empty' && tiles[row + 1][col + 1] === 'empty'
        );
      };

      // Randomly select positions for enemies (2x2 square)
      const tempEnemies = [];
      for (let i = 0; i < NUM_ENEMIES; i++) {
        const possibleSquares = emptyTiles.filter(pos => isValidSquare(pos.col, pos.row));
        if (possibleSquares.length > 0) {
          const randomIndex = Math.floor(Math.random() * possibleSquares.length);
          const position = possibleSquares[randomIndex];
          const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
          tempEnemies.push({ type: enemyType, col: position.col, row: position.row });
          emptyTiles.splice(emptyTiles.indexOf(position), 1);
        }
      }

      setLevelMap((prev)=>[...tiles]);
      
      setEnemies(tempEnemies);
      setBonuses([]);
    } catch (error) {
      console.error('Failed to load level:', error);
    }
  };

  useEffect(() => {
    loadLevel(1);  // Load level 1 by default
    
  
  }, []);

  // Function to check if a position is a valid square for movement
  const isValidMove = (col, row, direction) => {
    
    switch (direction) {
      case 'up':
        return levelMap[row] && levelMap[row][col] === 'empty' && levelMap[row][col + 1] === 'empty';
      case 'down':
        return levelMap[row + 1] && levelMap[row + 1][col] === 'empty' && levelMap[row + 1][col + 1] === 'empty';
      case 'left':
        return levelMap[row] && levelMap[row + 1] && levelMap[row][col] === 'empty' && levelMap[row + 1][col] === 'empty';
      case 'right':  
        return (
          levelMap[row] && 
          levelMap[row + 1] && 
          levelMap[row][col + 1] === 'empty' && 
          levelMap[row + 1][col + 1] === 'empty'
        );
      default:
        return false;
    }
  };  

  // Function to move enemies to the right
  const moveEnemiesRight = () => {
    const prevEnemies = [...enemies];
    const updatedEnemies = prevEnemies.map(enemy => {
      const newCol = enemy.col + 1;
      if (isValidMove(newCol, enemy.row, 'right')) {
        return { ...enemy, col: newCol };
      }
      return enemy;
    });
    setEnemies(updatedEnemies);
  };

  // Interval to move enemies to the right every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      moveEnemiesRight();
    }, 3000);

    return () => clearInterval(interval);
  }, [levelMap]);

  // Function to move the player up
  const movePlayerUp = () => {
    setPlayer(prevPlayer => {
      const newRow = prevPlayer.row - 1;
      if (isValidMove(prevPlayer.col, newRow, 'up')) {
        return { ...prevPlayer, row: newRow, direction: 'up' };
      }
      return prevPlayer;
    });
  };

  // Function to move the player down
  const movePlayerDown = () => {
    setPlayer(prevPlayer => {
      const newRow = prevPlayer.row + 1;
      if (isValidMove(prevPlayer.col, newRow, 'down')) {
        return { ...prevPlayer, row: newRow, direction: 'down' };
      }
      return prevPlayer;
    });
  };

  // Function to move the player left
  const movePlayerLeft = () => {
    setPlayer(prevPlayer => {
      const newCol = prevPlayer.col - 1;
      if (isValidMove(newCol, prevPlayer.row, 'left')) {
        return { ...prevPlayer, col: newCol, direction: 'left' };
      }
      return prevPlayer;
    });
  };

  // Function to move the player right
  const movePlayerRight = () => {    
    setPlayer(prevPlayer => {
      const newCol = prevPlayer.col + 1;
      if (isValidMove(newCol, prevPlayer.row, 'right')) {
        return { ...prevPlayer, col: newCol, direction: 'right' };
      }
      return prevPlayer;
    });
  };

  // Event listener for keydown event
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'w' || event.key === 'W') {
        movePlayerUp();
      } else if (event.key === 'a' || event.key === 'A') {
        movePlayerLeft();
      } else if (event.key === 's' || event.key === 'S') {
        movePlayerDown();
      } else if (event.key === 'd' || event.key === 'D') {
        movePlayerRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [levelMap]);

  // Function to get the rotation based on the player's direction
  const getRotation = (direction) => {
    switch (direction) {
      case 'up':
        return 'rotate(0deg)';
      case 'down':
        return 'rotate(180deg)';
      case 'left':
        return 'rotate(270deg)';
      case 'right':
        return 'rotate(90deg)';
      default:
        return 'rotate(0deg)';
    }
  };

  return (
    <div className="game-container">
      {levelMap.map((row, rowIndex) => (
        <div className="game-row" key={rowIndex}>
          {row.map((tile, tileIndex) => (
            <Tile key={tileIndex} type={tile} />
          ))}
        </div>
      ))}

      {/* Render Player */}
      <Tile
        type={`enemy_${player.type}`}
        style={{
          position: 'absolute',
          left: `${player.col * 32}px`,
          top: `${player.row * 32}px`,
          width: '64px',
          height: '64px',
          backgroundColor: player.color,
          transform: getRotation(player.direction),
        }}
      />

      {/* Render Enemies */}
      {enemies.map((enemy, index) => (
        <Tile
          key={index}
          type={`enemy_${enemy.type}`}
          style={{
            position: 'absolute',
            left: `${enemy.col * 32}px`,
            top: `${enemy.row * 32}px`,
            width: '64px',
            height: '64px',
          }}
        />
      ))}

      {/* Render Bonuses */}
      {bonuses.map((bonus, index) => (
        <Tile
          key={index}
          type={`bonus_${bonus.type}`}
          style={{
            position: 'absolute',
            left: `${bonus.col * 32}px`,
            top: `${bonus.row * 32}px`,
            width: '64px',
            height: '64px',
          }}
        />
      ))}
    </div>
  );
};

export default Game;
