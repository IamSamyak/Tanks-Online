// src/utils/bonusHandler.js
import { shieldCordinates } from '../constants/game-constants';
import { checkBonusCollision } from './collisions';

export const handleBonusCollision = (bonus, playerInfo, setEnemiesInfo, setPlayerInfo, setLevelMap, setBonus) => {
  const bonusTypeRewarded = checkBonusCollision(bonus, playerInfo);

  if (bonusTypeRewarded === 'bonus_grenade') {
    setEnemiesInfo([]); // Clear enemies
  } else if (bonusTypeRewarded === 'bonus_tank') {
    setPlayerInfo(prevPlayer => ({
      ...prevPlayer,
      lives: prevPlayer.lives + 1, // Increase player's lives by 1
    }));
  } else if (bonusTypeRewarded === 'bonus_star') {
    setPlayerInfo(prevPlayer => ({
      ...prevPlayer,
      star: prevPlayer.star + 1, // Increase player's star value by 1
    }));
  } else if (bonusTypeRewarded === 'bonus_shovel') {
    setLevelMap(prevMap => {
      const newMap = [...prevMap];
      const originalValues = [];

      // Store the original values before changing them
      shieldCordinates.forEach(coord => {
        const { row, col } = coord;
        if (newMap[row] && newMap[row][col]) {
          originalValues.push({ row, col, value: newMap[row][col] });
          newMap[row][col] = 'stone';
        }
      });

      // Revert the changes after 15 seconds
      setTimeout(() => {
        setLevelMap(currentMap => {
          const revertedMap = [...currentMap];
          originalValues.forEach(({ row, col, value }) => {
            revertedMap[row][col] = value;
          });
          return revertedMap;
        });
      }, 15000);
      return newMap;
    });
  }
  else if (bonusTypeRewarded === 'bonus_boat') {
    setPlayerInfo(prevPlayer => ({
      ...prevPlayer,
      boatBonus: true, // Activate boat bonus
    }));
  } else if (bonusTypeRewarded === 'bonus_clock') {
    // Freeze all enemies for 8 seconds
    setEnemiesInfo((prevEnemies) =>
      prevEnemies.map((enemy) => ({ ...enemy, frozen: true }))
    );

    // Set a timer to unfreeze enemies after 8 seconds
    setTimeout(() => {
      setEnemiesInfo((prevEnemies) =>
        prevEnemies.map((enemy) => ({ ...enemy, frozen: false }))
      );
    }, 8000);
  }
  if (bonusTypeRewarded) setBonus(null);
};
