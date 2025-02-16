// src/hooks/useMovement.js
import { useState } from 'react';

const useMovement = (initialPosition, levelMap) => {
  const [position, setPosition] = useState(initialPosition);

  // Function to check if a position is a valid square for movement
  const isValidMove = (col, row, direction) => {
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

  const moveUp = () => {
    setPosition(prevPosition => {
      const newRow = prevPosition.row - 1;
      if (isValidMove(prevPosition.col, newRow, 'up')) {
        return { ...prevPosition, row: newRow, direction: 'up' };
      }
      return { ...prevPosition, direction: 'up' };
    });
  };

  const moveDown = () => {
    setPosition(prevPosition => {
      const newRow = prevPosition.row + 1;
      if (isValidMove(prevPosition.col, newRow, 'down')) {
        return { ...prevPosition, row: newRow, direction: 'down' };
      }
      return { ...prevPosition, direction: 'down' };
    });
  };

  const moveLeft = () => {
    setPosition(prevPosition => {
      const newCol = prevPosition.col - 1;
      if (isValidMove(newCol, prevPosition.row, 'left')) {
        return { ...prevPosition, col: newCol, direction: 'left' };
      }
      return { ...prevPosition, direction: 'left' };
    });
  };

  const moveRight = () => {
    setPosition(prevPosition => {
      const newCol = prevPosition.col + 1;
      if (isValidMove(newCol, prevPosition.row, 'right')) {
        return { ...prevPosition, col: newCol, direction: 'right' };
      }
      return { ...prevPosition, direction: 'right' };
    });
  };

  // Centralized getRotations logic
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

  return {
    position,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    getRotation,
  };
};

export default useMovement;
