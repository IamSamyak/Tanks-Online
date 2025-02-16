import React, { useEffect, useState } from 'react';
import Tile from './Tile';

const bonusTypes = ['grenade', 'helmet', 'clock', 'shovel', 'tank', 'star', 'gun', 'boat'];

const BonusManager = ({ levelMap }) => {
  const [bonus, setBonus] = useState(null);

  const spawnBonus = (emptyTiles) => {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const position = emptyTiles[randomIndex];
    const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];

    setBonus({
      type: `bonus_${randomBonusType}`,
      col: position.col,
      row: position.row,
    });

    setTimeout(() => {
      setBonus(null); // Clear bonus after 10 seconds
      setTimeout(() => spawnBonus(emptyTiles), 10000); // Respawn another bonus after 10 seconds
    }, 10000);
  };

  const handleBonus = (bonusType) => {
    switch (bonusType) {
      case 'bonus_grenade':
        console.log('Grenade: all enemies are destroyed');
        break;
      case 'bonus_helmet':
        console.log('Helmet: active player shield for 10 seconds');
        break;
      case 'bonus_clock':
        console.log('Clock: freeze all enemies for 8 seconds');
        break;
      case 'bonus_shovel':
        console.log('Shovel: create stone wall around eagle for 15 seconds');
        break;
      case 'bonus_tank':
        console.log('Tank: increase player lives count');
        break;
      case 'bonus_star':
        console.log('Star: increase player speed, each next one increases max bullets count');
        break;
      case 'bonus_gun':
        console.log('Gun: same as three stars');
        break;
      case 'bonus_boat':
        console.log('Boat: allows to move on the water');
        break;
      default:
        console.log('Unknown bonus type');
    }
  };

  useEffect(() => {
    const emptyTiles = [];
    levelMap.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile === 'empty') {
          emptyTiles.push({ col: colIndex, row: rowIndex });
        }
      });
    });
    spawnBonus(emptyTiles);
  }, [levelMap]);

  useEffect(() => {
    if (bonus) {
      handleBonus(bonus.type);
    }
  }, [bonus]);

  return (
    bonus && (
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
    )
  );
};

export default BonusManager;
