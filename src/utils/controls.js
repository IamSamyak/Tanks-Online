// src/utils/controls.js
import { moveUp, moveDown, moveLeft, moveRight } from './movement';
import { speedBuffer } from '../constants/game-constants';
import { shoot } from './actions';

// Handle Player Movement
export const handleMovement = (event, setPlayerInfo, levelMap, speedLevel, lastMoveTime, setLastMoveTime) => {
  const currentTime = Date.now();

  // Check if enough time has passed since the last move for buffering
  if (currentTime - lastMoveTime < speedBuffer[speedLevel]) {
    return;
  }

  setLastMoveTime(currentTime);

  if (event.key === 'w' || event.key === 'W') {
    setPlayerInfo(prevPlayer => moveUp(prevPlayer, levelMap));
  } else if (event.key === 'a' || event.key === 'A') {
    setPlayerInfo(prevPlayer => moveLeft(prevPlayer, levelMap));
  } else if (event.key === 's' || event.key === 'S') {
    setPlayerInfo(prevPlayer => moveDown(prevPlayer, levelMap));
  } else if (event.key === 'd' || event.key === 'D') {
    setPlayerInfo(prevPlayer => moveRight(prevPlayer, levelMap));
  }
};

// Handle Shooting
export const handleShooting = (event, bullets, playerInfo, levelMap, setLevelMap, setBullets, setExplosions) => {
  if ((event.key === 'f' || event.key === 'F' || event.button === 0) && bullets.length < playerInfo.star) {
    shoot(playerInfo, levelMap, setLevelMap, setBullets, setExplosions);
  }
};
