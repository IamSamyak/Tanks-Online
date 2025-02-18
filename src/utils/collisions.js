// utils.js
import { tileMapping } from "../constants/game-constants";

export const checkBonusCollision = (bonus, player) => {
    if (bonus) {
        const { row: bonusRow, col: bonusCol } = bonus;
        // Check all four corners of the tank
        if (
            (player.row === bonusRow && player.col === bonusCol) || // Top-left
            (player.row === bonusRow && player.col + 1 === bonusCol) || // Top-right
            (player.row + 1 === bonusRow && player.col === bonusCol) || // Bottom-left
            (player.row + 1 === bonusRow && player.col + 1 === bonusCol) // Bottom-right
        ) {
            console.log('Bonus collected:', bonus.type);
            return bonus.type;
            // Add logic here to update score, remove bonus from the map, etc.
        }
    }
    return '';
};


const collisionWithBase = (newRow, newCol, setExplosions) => {
    // Define base positions (base + surrounding 4 spots)
    const basePositions = [
      {  row: 24, col: 12 }, // Base
      {  row: 25, col: 12 }, // Right
      {  row: 24, col: 13 }, // Below
      {  row: 25, col: 13 }, // Bottom-right
    ];
  
    // Check if the bullet hits any of the base positions
    for (const pos of basePositions) {
      if (newRow === pos.row && newCol === pos.col) {
        // alert("Game Over!");
  
        // Trigger explosions around the base spots
        setExplosions((prevExplosions) => [
          ...prevExplosions,
          { row: pos.row, col: pos.col }, // Add explosion at the base position
        ]);

        return true; // Bullet stops if it hits the base
      }
    }
  
    return false; // No collision with the base
  };
  

// Handles collision with brick tiles
const collisionWithBrick = (newRow, newCol, bullet, levelMap, setLevelMap, setExplosions) => {
    setExplosions((prev) => [...prev, { row: newRow, col: newCol }]);

    const updatedMap = levelMap.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
            if (
                (rowIndex === newRow && colIndex === bullet.col) ||
                (rowIndex === newRow && colIndex === bullet.col + 1) ||
                (rowIndex === bullet.row && colIndex === newCol) ||
                (rowIndex === bullet.row + 1 && colIndex === newCol)
            ) {
                return 'empty';
            }
            return tile;
        })
    );
    setLevelMap(updatedMap);
};

// Handles collision with stone tiles
const collisionWithStone = (newRow, newCol, setExplosions) => {
    setExplosions((prev) => [...prev, { row: newRow, col: newCol }]);
    // Currently no change to the map, but you can add logic later if needed
};

// Handles collision with water tiles
const collisionWithWater = () => {
    // Bullet ends here without explosion or map change
    return null;
};

export const handleBulletCollisionEnemy = (bullet, levelMap, setLevelMap, setExplosions, setBaseDestroyed) => {
    let newRow = bullet.row;
    let newCol = bullet.col;

    switch (bullet.direction) {
        case 'up':
            newRow -= 1;
            break;
        case 'down':
            newRow += 1;
            break;
        case 'left':
            newCol -= 1;
            break;
        case 'right':
            newCol += 1;
            break;
        default:
            break;
    }

    let tile1, tile2;
    switch (bullet.direction) {
        case 'up':
        case 'down':
            tile1 = levelMap[newRow] ? levelMap[newRow][bullet.col] : null;
            tile2 = levelMap[newRow] ? levelMap[newRow][bullet.col + 1] : null;
            break;
        case 'left':
        case 'right':
            tile1 = levelMap[bullet.row] ? levelMap[bullet.row][newCol] : null;
            tile2 = levelMap[bullet.row + 1] ? levelMap[bullet.row + 1][newCol] : null;
            break;
        default:
            break;
    }    

    if (collisionWithBase(newRow, newCol, setExplosions)) {
        setBaseDestroyed(true);
      return null; // Stop the bullet if it hits the base
    }

    // Check for collisions
    if (tile1 && tile1 !== 'empty') {
        if (tile1 === 'brick') {
            collisionWithBrick(newRow, newCol, bullet, levelMap, setLevelMap, setExplosions);
        } else if (tile1 === 'stone') {
            collisionWithStone(newRow, newCol, setExplosions);
        } else if (tile1 === 'water') {
            return collisionWithWater();
        }
        return null;
    }

    if (tile2 && tile2 !== 'empty') {
        if (tile2 === 'brick') {
            collisionWithBrick(newRow, newCol, bullet, levelMap, setLevelMap, setExplosions);
        } else if (tile2 === 'stone') {
            collisionWithStone(newRow, newCol, setExplosions);
        } else if (tile2 === 'water') {
            return collisionWithWater();
        }
        return null;
    }

    // Move bullet if next tile is empty
    if (levelMap[newRow] && levelMap[newRow][newCol] === 'empty') {
        return { ...bullet, row: newRow, col: newCol };
    }

    return null;
};

const collisionWithEnemy = (newRow, newCol, enemiesInfo, setExplosions, setEnemiesInfo) => {
    // Check for collision with any of the 4 tiles occupied by each enemy
    const enemy = enemiesInfo.find(enemy => 
        (newRow === enemy.row && newCol === enemy.col) ||                         // Top-left
        (newRow === enemy.row && newCol === enemy.col + 1) ||                     // Top-right
        (newRow === enemy.row + 1 && newCol === enemy.col) ||                     // Bottom-left
        (newRow === enemy.row + 1 && newCol === enemy.col + 1)                    // Bottom-right
    );

    if (enemy) {
        // Decrease enemy health
        enemy.health -= 1;
        console.log(`Enemy health: ${enemy.health}`);

        // If health is 0, add explosion and remove enemy
        if (enemy.health <= 0) {
            // Add explosion at the center of the 2x2 grid
            setExplosions((prev) => [...prev, { row: enemy.row, col: enemy.col }]);
            setEnemiesInfo((prevEnemies) => prevEnemies.filter(e => e !== enemy));
            console.log('Enemy destroyed!');
        }
        return true; // Indicate the enemy was hit
    }
    return false; // No enemy hit
};


export const handleBulletCollision = (bullet, levelMap, setLevelMap, setExplosions, enemiesInfo, setEnemiesInfo, setBaseDestroyed) => {
    let newRow = bullet.row;
    let newCol = bullet.col;
  
    switch (bullet.direction) {
      case 'up':
        newRow -= 1;
        break;
      case 'down':
        newRow += 1;
        break;
      case 'left':
        newCol -= 1;
        break;
      case 'right':
        newCol += 1;
        break;
      default:
        break;
    }
  
    let tile1, tile2;
    switch (bullet.direction) {
      case 'up':
      case 'down':
        tile1 = levelMap[newRow] ? levelMap[newRow][bullet.col] : null;
        tile2 = levelMap[newRow] ? levelMap[newRow][bullet.col + 1] : null;
        break;
      case 'left':
      case 'right':
        tile1 = levelMap[bullet.row] ? levelMap[bullet.row][newCol] : null;
        tile2 = levelMap[bullet.row + 1] ? levelMap[bullet.row + 1][newCol] : null;
        break;
      default:
        break;
    }
  
    // Check if the bullet hits the base (using the new function)
    if (collisionWithBase(newRow, newCol, setExplosions)) {
        setBaseDestroyed(true);
      return null; // Stop the bullet if it hits the base
    }
  
    // Handle other collisions (brick, stone, water, etc.)
    if (collisionWithEnemy(newRow, newCol, enemiesInfo, setExplosions, setEnemiesInfo)) {
      return null; // Bullet stops if it hits an enemy
    }
  
    // Check for collisions with other tiles (e.g., brick, stone, water)
    if (tile1 && tile1 !== 'empty') {
      if (tile1 === 'brick') {
        collisionWithBrick(newRow, newCol, bullet, levelMap, setLevelMap, setExplosions);
      } else if (tile1 === 'stone') {
        collisionWithStone(newRow, newCol, setExplosions);
      } else if (tile1 === 'water') {
        return collisionWithWater();
      }
      return null;
    }
  
    if (tile2 && tile2 !== 'empty') {
      if (tile2 === 'brick') {
        collisionWithBrick(newRow, newCol, bullet, levelMap, setLevelMap, setExplosions);
      } else if (tile2 === 'stone') {
        collisionWithStone(newRow, newCol, setExplosions);
      } else if (tile2 === 'water') {
        return collisionWithWater();
      }
      return null;
    }
  
    // Move bullet if next tile is empty
    if (levelMap[newRow] && levelMap[newRow][newCol] === 'empty') {
      return { ...bullet, row: newRow, col: newCol };
    }
  
    return null;
  };
  
  

