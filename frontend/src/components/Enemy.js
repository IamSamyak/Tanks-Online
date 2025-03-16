import React, { useEffect, useState } from 'react';
import { getRotation } from '../utils/movement';
import {
  moveEnemyA,
  moveEnemyB,
  moveEnemyC,
  moveEnemyD,
} from '../utils/automated_enemy_movement';
import Tile from './Tile';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { handleBulletCollisionEnemy } from '../utils/collisions';
import { shoot } from '../utils/actions';

const Enemy = ({ levelMap, setLevelMap, initialPosition, type = 'A', target, updatePosition, frozen, setBaseDestroyed }) => {
  const [enemy, setEnemy] = useState({
    ...initialPosition,
    direction: 'up',
    armour: 4,  // Maximum armour level
  });
  const [bullets, setBullets] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [canFire, setCanFire] = useState(true);

  // Handle Automated Movements (if not frozen)
  useEffect(() => {
    if (frozen) return; // If frozen, skip movement

    const interval = setInterval(() => {
      let newEnemyPosition;
      switch (type) {
        case 'A':
          newEnemyPosition = moveEnemyA(enemy, target, levelMap);
          break;
        case 'B':
          newEnemyPosition = moveEnemyB(enemy, target, levelMap);
          break;
        case 'C':
          newEnemyPosition = moveEnemyC(enemy, target, levelMap);
          break;
        case 'D':
          newEnemyPosition = moveEnemyD(enemy, target, levelMap);
          break;
        default:
          newEnemyPosition = moveEnemyA(enemy, target, levelMap);
      }

      // Update enemy position and inform the parent component
      setEnemy(newEnemyPosition);
      
      updatePosition(enemy.id, newEnemyPosition); // Notify parent about position update
    }, 1500);

    return () => clearInterval(interval);
  }, [enemy, levelMap, type, target, updatePosition, frozen,setBaseDestroyed]);

  // Handle Shooting Bullets (if not frozen)
  useEffect(() => {
    if (canFire && !frozen) {
      shoot(enemy, levelMap, setLevelMap, setBullets, setExplosions);
      setCanFire(false);
    }
  }, [canFire, enemy, levelMap, setLevelMap, frozen]);

  // Handle Bullet Movements and Collisions
  useEffect(() => {
    if (frozen) return; // Skip bullet movement if frozen

    const interval = setInterval(() => {
      setBullets(prevBullets =>
        prevBullets
          .map(bullet => 
            handleBulletCollisionEnemy(bullet, levelMap, setLevelMap, setExplosions, () => {
              setCanFire(true); // Allow firing again after collision
            })
          )
          .filter(bullet => bullet !== null)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [levelMap, setLevelMap, frozen]);

  // Handle Explosions Cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setExplosions(prev => prev.slice(1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Render Enemy and its Bullets and Explosions
  return (
    <>
      <Tile
        type={`enemy_${type}`}
        style={{
          position: 'absolute',
          left: `${enemy.col * 32}px`,
          top: `${enemy.row * 32}px`,
          width: '64px',
          height: '64px',
          transform: getRotation(enemy.direction),
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
    </>
  );
};

export default Enemy;
