// spawn.js
import { bonusTypes } from '../constants/game-constants'; 

// Function to spawn enemies at random positions
export const spawnEnemies = (emptyTiles, NUM_ENEMIES) => {
    const tempEnemies = [];
    for (let i = 0; i < NUM_ENEMIES; i++) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const position = emptyTiles[randomIndex];
      tempEnemies.push({
        id: `enemy_${i}`,
        type: 'A', // You can customize the enemy type
        col: position.col,
        row: position.row,
        direction: 'up', // You can customize the initial direction
      });
      emptyTiles.splice(randomIndex, 1); // Remove the occupied tile from the list
    }
    return tempEnemies;
  };
  
export const spwanBonus = (emptyTiles, setBonus) => {
  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const position = emptyTiles[randomIndex];
  const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];

  setBonus({
    type: `bonus_${randomBonusType}`,
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

  