import React, { useEffect } from 'react';
import Tile from './Tile';
import Bullet from './Bullet';

const directions = ['up', 'right', 'down', 'left'];
const directionDeltas = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

// Armor Colors
const armorColors = ['gray', 'blue', 'green', 'red'];

// Get Target Position
const getTarget = (type) => {
  if (type === 'B' || type === 'C') {
    return { row: 24, col: 12 }; // Eagle Position
  }
  return { row: 24, col: 12 }; // Closest Player or Eagle
};

// Movement Probability
const getMoveDirection = (enemy, target) => {
  const towardsTarget = Math.random() < (
    enemy.type === 'A' ? 0.8 : 
    enemy.type === 'B' ? 0.5 : 
    enemy.type === 'C' ? 0.5 : 
    enemy.type === 'D' ? 0.5 : 0
  );

  if (towardsTarget) {
    if (Math.abs(enemy.row - target.row) > Math.abs(enemy.col - target.col)) {
      return enemy.row > target.row ? 'up' : 'down';
    } else {
      return enemy.col > target.col ? 'left' : 'right';
    }
  }
  return directions[Math.floor(Math.random() * directions.length)];
};

// Move Enemy
const moveEnemy = (enemy, levelMap) => {
  const target = getTarget(enemy.type);
  const direction = getMoveDirection(enemy, target);
  const { row: deltaRow, col: deltaCol } = directionDeltas[direction];

  const newRow = enemy.row + deltaRow;
  const newCol = enemy.col + deltaCol;

  const isValidMove = levelMap[newRow] && levelMap[newRow][newCol] === 'empty';

  if (isValidMove) {
    return { ...enemy, row: newRow, col: newCol, direction };
  }
  return enemy;
};

// Fire Bullet
const fireBullet = (enemy) => {
  if (!enemy.bullet) {
    const { row, col, direction } = enemy;
    return {
      row,
      col,
      direction,
      active: true,
    };
  }
  return enemy.bullet;
};

// Move Bullet
const moveBullet = (bullet, levelMap) => {
  if (!bullet.active) return bullet;

  const { direction } = bullet;
  const { row: deltaRow, col: deltaCol } = directionDeltas[direction];

  const newRow = bullet.row + deltaRow;
  const newCol = bullet.col + deltaCol;

  const hitObstacle = !levelMap[newRow] || levelMap[newRow][newCol] !== 'empty';

  if (hitObstacle) {
    return { ...bullet, active: false };
  }
  return { ...bullet, row: newRow, col: newCol };
};

// Enemies Component
const Enemies = ({ enemies, setEnemies, levelMap }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          // Move Enemy
          const movedEnemy = moveEnemy(enemy, levelMap);

          // Initialize lastFireTime if not present
          if (!movedEnemy.lastFireTime) {
            movedEnemy.lastFireTime = Date.now();
          }

          // Fire Bullet every 5 seconds
          const timeSinceLastFire = Date.now() - movedEnemy.lastFireTime;
          if (timeSinceLastFire >= 5000) {
            movedEnemy.bullet = fireBullet(movedEnemy);
            movedEnemy.lastFireTime = Date.now(); // Reset fire timer
          }

          // Move Bullet
          if (movedEnemy.bullet) {
            movedEnemy.bullet = moveBullet(movedEnemy.bullet, levelMap);
          }

          // Decrease Armor or Destroy Enemy
          if (movedEnemy.hit) {
            movedEnemy.armor--;
            movedEnemy.hit = false;
            if (movedEnemy.armor <= 0) {
              return null; // Enemy Destroyed
            }
          }

          return movedEnemy;
        }).filter(Boolean)
      );
    }, 500);

    return () => clearInterval(interval);
  }, [levelMap, setEnemies]);

  return (
    <>
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
            backgroundColor: armorColors[enemy.armor - 1],
            transform: `rotate(${directions.indexOf(enemy.direction) * 90}deg)`,
          }}
        />
      ))}
      {enemies.map((enemy, index) => (
        enemy.bullet && enemy.bullet.active && (
          <Bullet key={`bullet_${index}`} bullet={enemy.bullet} />
        )
      ))}
    </>
  );
};

export default Enemies;
