import { moveUp, moveDown, moveLeft, moveRight } from './movement';

// Utility function to get a random direction
const getRandomDirection = () => {
  const directions = ['up', 'down', 'left', 'right'];
  const randomIndex = Math.floor(Math.random() * directions.length);
  return directions[randomIndex];
};

// Get the direction towards the target
const getDirectionToTarget = (enemy, target) => {
  const rowDiff = target.row - enemy.row;
  const colDiff = target.col - enemy.col;

  if (Math.abs(rowDiff) > Math.abs(colDiff)) {
    return rowDiff > 0 ? 'down' : 'up';
  } else {
    return colDiff > 0 ? 'right' : 'left';
  }
};

// Move enemy based on direction
const moveEnemy = (enemy, direction, levelMap, speed = 1) => {
  let newEnemy = { ...enemy };
  for (let i = 0; i < speed; i++) {
    if (direction === 'up') newEnemy = moveUp(newEnemy, levelMap);
    else if (direction === 'down') newEnemy = moveDown(newEnemy, levelMap);
    else if (direction === 'left') newEnemy = moveLeft(newEnemy, levelMap);
    else if (direction === 'right') newEnemy = moveRight(newEnemy, levelMap);
  }
  return newEnemy;
};

// Enemy A Movement (80% towards target, 20% random, normal speed)
export const moveEnemyA = (enemy, target, levelMap) => {
  const random = Math.random();
  const direction =
    random < 0.8
      ? getDirectionToTarget(enemy, target)
      : getRandomDirection();
  return moveEnemy(enemy, direction, levelMap);
};

// Enemy B Movement (50% towards target, 50% random, 1.3x speed)
export const moveEnemyB = (enemy, target, levelMap) => {
  const random = Math.random();
  const direction =
    random < 0.5
      ? getDirectionToTarget(enemy, target)
      : getRandomDirection();
  return moveEnemy(enemy, direction, levelMap, 1.3);
};

// Enemy C Movement (50% towards target, 50% random, normal speed)
export const moveEnemyC = (enemy, target, levelMap) => {
  const random = Math.random();
  const direction =
    random < 0.5
      ? getDirectionToTarget(enemy, target)
      : getRandomDirection();
  return moveEnemy(enemy, direction, levelMap);
};

// Enemy D Movement (50% towards target, 50% random, normal speed)
export const moveEnemyD = (enemy, target, levelMap) => {
  const random = Math.random();
  const direction =
    random < 0.5
      ? getDirectionToTarget(enemy, target)
      : getRandomDirection();
  return moveEnemy(enemy, direction, levelMap);
};
