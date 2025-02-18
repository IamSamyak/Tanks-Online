// spawn.js
import { bonusTypes } from '../constants/game-constants'; 
// spwan.js

export const spawnEnemy = (prevEnemies, setEnemiesInfo, MAX_ENEMIES) => {
  if (prevEnemies.length >= MAX_ENEMIES) return prevEnemies;

  const randomCol = [0, 12, 24][Math.floor(Math.random() * 3)];
  const randomRow = 0;
  const newEnemy = {
    id: `enemy_${Date.now()}`,
    type: 'A',
    col: randomCol,
    row: randomRow,
    direction: 'down',
    health: 2,
    frozen: false,
    boatBonus: false,
  };

  setEnemiesInfo([...prevEnemies, newEnemy]);
};

  
export const spwanBonus = (emptyTiles, setBonus) => {
  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const position = emptyTiles[randomIndex];
  const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];

  setBonus({
    // type: `bonus_${randomBonusType}`,
    type: `bonus_shovel`,
    col: position.col,
    row: position.row,
  });

  setTimeout(() => {
    setBonus(null);
    setTimeout(() => {
      spwanBonus(emptyTiles, setBonus); // Respawn bonus after 10 seconds
    }, 10000);
  }, 5000); // Bonus disappears after 5 seconds
};

  