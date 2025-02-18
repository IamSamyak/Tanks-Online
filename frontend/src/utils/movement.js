// src/utils/movement.js

// Function to check if a playerInfo is a valid square for movement
const isValidMove = (col, row, levelMap, direction,boatBonus) => {
    const isEmpty = (c, r) => levelMap[r] && (levelMap[r][c] === 'empty' || levelMap[r][c] === 'bush' || (boatBonus && levelMap[r][c] === 'water'));
  
    switch (direction) {
      case 'up':
        return isEmpty(col, row) && isEmpty(col + 1, row);
      case 'down':
        return isEmpty(col, row + 1) && isEmpty(col + 1, row + 1);
      case 'left':
        return isEmpty(col, row) && isEmpty(col, row + 1);
      case 'right':
        return isEmpty(col + 1, row) && isEmpty(col + 1, row + 1);
      default:
        return false;
    }
  };
  
  // Functions for each movement direction
  const moveUp = (playerInfo, levelMap) => {
    const newRow = playerInfo.row - 1;
    if (isValidMove(playerInfo.col, newRow, levelMap, 'up',playerInfo.boatBonus)) {
      return { ...playerInfo, row: newRow, direction: 'up' };
    }
    return { ...playerInfo, direction: 'up' };
  };
  
  const moveDown = (playerInfo, levelMap) => {
    const newRow = playerInfo.row + 1;
    if (isValidMove(playerInfo.col, newRow, levelMap, 'down',playerInfo.boatBonus)) {
      return { ...playerInfo, row: newRow, direction: 'down' };
    }
    return { ...playerInfo, direction: 'down' };
  };
  
  const moveLeft = (playerInfo, levelMap) => {
    const newCol = playerInfo.col - 1;
    if (isValidMove(newCol, playerInfo.row, levelMap, 'left',playerInfo.boatBonus)) {
      return { ...playerInfo, col: newCol, direction: 'left' };
    }
    return { ...playerInfo, direction: 'left' };
  };
  
  const moveRight = (playerInfo, levelMap) => {
    const newCol = playerInfo.col + 1;
    if (isValidMove(newCol, playerInfo.row, levelMap, 'right',playerInfo.boatBonus)) {
      return { ...playerInfo, col: newCol, direction: 'right' };
    }
    return { ...playerInfo, direction: 'right' };
  };
  
  // Centralized getRotation logic
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
  
  export {
    isValidMove,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    getRotation
  };
  