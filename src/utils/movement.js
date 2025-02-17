// src/utils/movement.js

// Function to check if a position is a valid square for movement
const isValidMove = (col, row, levelMap, direction) => {
    const isEmpty = (c, r) => levelMap[r] && (levelMap[r][c] === 'empty' || levelMap[r][c] === 'bush');
  
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
  const moveUp = (position, levelMap) => {
    const newRow = position.row - 1;
    if (isValidMove(position.col, newRow, levelMap, 'up')) {
      return { ...position, row: newRow, direction: 'up' };
    }
    return { ...position, direction: 'up' };
  };
  
  const moveDown = (position, levelMap) => {
    const newRow = position.row + 1;
    if (isValidMove(position.col, newRow, levelMap, 'down')) {
      return { ...position, row: newRow, direction: 'down' };
    }
    return { ...position, direction: 'down' };
  };
  
  const moveLeft = (position, levelMap) => {
    const newCol = position.col - 1;
    if (isValidMove(newCol, position.row, levelMap, 'left')) {
      return { ...position, col: newCol, direction: 'left' };
    }
    return { ...position, direction: 'left' };
  };
  
  const moveRight = (position, levelMap) => {
    const newCol = position.col + 1;
    if (isValidMove(newCol, position.row, levelMap, 'right')) {
      return { ...position, col: newCol, direction: 'right' };
    }
    return { ...position, direction: 'right' };
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
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    getRotation,
  };
  