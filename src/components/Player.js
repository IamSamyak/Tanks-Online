import React, { useEffect, useState } from 'react';
import Tile from './Tile';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { checkBonusCollision, handleBulletCollision } from '../utils/collisions';
import { shoot } from '../utils/actions';
import { moveUp, moveDown, moveLeft, moveRight, getRotation } from '../utils/movement'; // Using movement util

const Player = ({ levelMap, setLevelMap, playerPosition, setPlayerPosition, bonus }) => {
    const [bullets, setBullets] = useState([]);
    const [explosions, setExplosions] = useState([]);

    // Handle Bonus Collision
    useEffect(() => {
        checkBonusCollision(bonus, playerPosition);
    }, [playerPosition, bonus]);

    // Handle Player Movement and Shooting
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'w' || event.key === 'W') {
                setPlayerPosition(prevPlayer => moveUp(prevPlayer, levelMap));
            } else if (event.key === 'a' || event.key === 'A') {
                setPlayerPosition(prevPlayer => moveLeft(prevPlayer, levelMap));
            } else if (event.key === 's' || event.key === 'S') {
                setPlayerPosition(prevPlayer => moveDown(prevPlayer, levelMap));
            } else if (event.key === 'd' || event.key === 'D') {
                setPlayerPosition(prevPlayer => moveRight(prevPlayer, levelMap));
            } else if (event.key === 'f' || event.key === 'F') {
                shoot(playerPosition, levelMap, setLevelMap, setBullets, setExplosions);
            }
        };

        const handleMouseDown = (event) => {
            if (event.button === 0) {
                shoot(playerPosition, levelMap, setLevelMap, setBullets, setExplosions);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [playerPosition, levelMap, setLevelMap]);

    // Handle Bullet Movements and Collisions
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
                    left: `${playerPosition.col * 32}px`,
                    top: `${playerPosition.row * 32}px`,
                    width: '64px',
                    height: '64px',
                    backgroundColor: playerPosition.color,
                    transform: getRotation(playerPosition.direction),
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

export default Player;
