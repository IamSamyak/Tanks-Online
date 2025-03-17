import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { getRotation } from '../utils/movement';
import { handleBulletCollision } from '../utils/collisions';
import { handleMovement, handleShooting } from '../utils/controls';

const socket = new WebSocket('ws://localhost:8080/game');

const OnlinePlayer = ({ levelMap, setLevelMap, playerInfo, setPlayerInfo, enemiesInfo, setEnemiesInfo, setBaseDestroyed }) => {
  const [bullets, setBullets] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [lastMoveTime, setLastMoveTime] = useState(0);

  const speedLevel = playerInfo.star === 1 ? 'low' : playerInfo.star === 2 ? 'medium' : 'high';

  // Handle Socket Messages for OnlinePlayer Input
  useEffect(() => {
    socket.onmessage = (event) => {
      const data = event.data.trim();

      if (["w", "a", "s", "d"].includes(data)) {
        handleMovement({ key: data }, setPlayerInfo, levelMap, speedLevel, lastMoveTime, setLastMoveTime);
      } else if (data === "f") {
        handleShooting({ key: data }, bullets, playerInfo, levelMap, setLevelMap, setBullets, setExplosions);
      }
    };

    return () => {
      socket.close();
    };
  }, [levelMap, setPlayerInfo, speedLevel, lastMoveTime, bullets, playerInfo, setLevelMap]);

  // Handle Bullet Movements and Collisions
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => handleBulletCollision(bullet, levelMap, setLevelMap, setExplosions, [...enemiesInfo], setEnemiesInfo, setBaseDestroyed))
          .filter((bullet) => bullet !== null)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [levelMap, setLevelMap, enemiesInfo, setEnemiesInfo, setBaseDestroyed]);

  return (
    <>
      <Tile
        type="enemy_A"
        style={{
          position: 'absolute',
          left: `${playerInfo.col * 32}px`,
          top: `${playerInfo.row * 32}px`,
          width: '64px',
          height: '64px',
          backgroundColor: playerInfo.color,
          transform: getRotation(playerInfo.direction),
        }}
      />
      {bullets.map((bullet, index) => (
        <Bullet
          key={index}
          bullet={bullet}
          style={{
            position: 'absolute',
            left: `${bullet.col * 32}px`,
            top: `${bullet.row * 32}px`,
          }}
        />
      ))}
      {explosions.map((explosion, index) => (
        <Explosion
          key={index}
          explosion={explosion}
          style={{
            position: 'absolute',
            left: `${explosion.col * 32}px`,
            top: `${explosion.row * 32}px`,
          }}
        />
      ))}
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'black', padding: '5px', borderRadius: '5px' }}>
        Speed Level: {speedLevel.toUpperCase()}
      </div>
    </>
  );
};

export default OnlinePlayer;
