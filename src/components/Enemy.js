import React, { useEffect, useState } from 'react';
import useMovement from '../hooks/useMovement';
import Tile from './Tile';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { handleBulletCollision } from '../utils/collisions';
import { shoot } from '../utils/actions';

const Enemy = ({ levelMap, setLevelMap, initialPosition }) => {
    const {
        position: enemy,
        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        getRotation,
    } = useMovement(initialPosition, levelMap);

    const [bullets, setBullets] = useState([]);
    const [explosions, setExplosions] = useState([]);

    const getRandomDirection = () => {
        const directions = ['up', 'down', 'left', 'right'];
        const randomIndex = Math.floor(Math.random() * directions.length);
        return directions[randomIndex];
    };

    useEffect(() => {        
        const interval = setInterval(() => {
            
            const random = Math.random();
            console.log('random is ',random);
            if (random < 0.5) {
                // Move straight
                if (enemy.direction === 'up') moveUp();
                else if (enemy.direction === 'down') moveDown();
                else if (enemy.direction === 'left') moveLeft();
                else if (enemy.direction === 'right') moveRight();
            } else if (random < 0.8) {
                // Rotate (change direction without moving)
                const newDirection = getRandomDirection();
                enemy.direction = newDirection;
            } else {
                // Fire a bullet
                shoot(enemy, levelMap, setLevelMap, setBullets, setExplosions);
            }
        }, 500); // Adjust the interval as needed

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBullets((prevBullets) =>
                prevBullets
                    .map((bullet) => handleBulletCollision(bullet, levelMap, setLevelMap, setExplosions))
                    .filter((bullet) => bullet !== null)
            );
        }, 100);

        return () => clearInterval(interval);
    }, [levelMap, setLevelMap]);

    return (
        <>
            <Tile
                type="enemy_A"
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
