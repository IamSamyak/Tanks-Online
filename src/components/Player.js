import React, { useEffect, useState } from 'react';
import useMovement from '../hooks/useMovement';
import Tile from './Tile';
import Bullet from './Bullet';
import Explosion from './Explosion';

const Player = ({ levelMap, setLevelMap, initialPosition }) => {
    const {
        position: player,
        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        getRotation,
    } = useMovement(initialPosition, levelMap);

    const [bullets, setBullets] = useState([]);
    const [explosions, setExplosions] = useState([]);
    const [bonuses, setBonuses] = useState([]);

    useEffect(() => {
        // Extract bonus positions from the level map
        const bonusPositions = [];
        levelMap.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                if (tile.startsWith('bonus_')) {
                    bonusPositions.push({
                        row: rowIndex,
                        col: colIndex,
                        type: tile,
                    });
                }
            });
        });
        setBonuses(bonusPositions);
    }, [levelMap]);

    const shoot = () => {
        let bulletRow = player.row;
        let bulletCol = player.col;
        let tile1, tile2;

        switch (player.direction) {
            case 'up':
                bulletRow -= 1;
                tile1 = levelMap[bulletRow] ? levelMap[bulletRow][bulletCol] : null;
                tile2 = levelMap[bulletRow] ? levelMap[bulletRow][bulletCol + 1] : null;
                break;
            case 'down':
                bulletRow += 1;
                tile1 = levelMap[bulletRow + 1] ? levelMap[bulletRow + 1][bulletCol] : null;
                tile2 = levelMap[bulletRow + 1] ? levelMap[bulletRow + 1][bulletCol + 1] : null;
                break;
            case 'left':
                bulletCol -= 1;
                tile1 = levelMap[bulletRow] ? levelMap[bulletRow][bulletCol] : null;
                tile2 = levelMap[bulletRow + 1] ? levelMap[bulletRow + 1][bulletCol] : null;
                break;
            case 'right':
                bulletCol += 1;
                tile1 = levelMap[bulletRow] ? levelMap[bulletRow][bulletCol + 1] : null;
                tile2 = levelMap[bulletRow + 1] ? levelMap[bulletRow + 1][bulletCol + 1] : null;
                break;
            default:
                break;
        }

        if ((tile1 && tile1 !== 'empty') || (tile2 && tile2 !== 'empty')) {
            setExplosions((prevExplosions) => [
                ...prevExplosions,
                { row: bulletRow, col: bulletCol },
            ]);

            const updatedMap = levelMap.map((row, rowIndex) =>
                row.map((tile, colIndex) => {
                    if (
                        (rowIndex === bulletRow && colIndex === bulletCol) ||
                        (rowIndex === bulletRow && colIndex === bulletCol + 1) ||
                        (rowIndex === bulletRow + 1 && colIndex === bulletCol) ||
                        (rowIndex === bulletRow + 1 && colIndex === bulletCol + 1)
                    ) {
                        return 'empty';
                    }
                    return tile;
                })
            );
            setLevelMap(updatedMap);
        } else {
            setBullets((prevBullets) => [
                ...prevBullets,
                {
                    row: bulletRow,
                    col: bulletCol,
                    direction: player.direction,
                },
            ]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'w' || event.key === 'W') moveUp();
            else if (event.key === 'a' || event.key === 'A') moveLeft();
            else if (event.key === 's' || event.key === 'S') moveDown();
            else if (event.key === 'd' || event.key === 'D') moveRight();
            else if (event.key === 'f' || event.key === 'F') shoot();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [moveUp, moveDown, moveLeft, moveRight, player.direction]);

    useEffect(() => {
        // Check if player is on a bonus
        const currentBonus = bonuses.find(
            (bonus) => bonus.row === player.row && bonus.col === player.col
        );

        if (currentBonus) {
            console.log(`Achieved Bonus: ${currentBonus.type}`);
            setBonuses((prevBonuses) =>
                prevBonuses.filter(
                    (bonus) =>
                        !(bonus.row === currentBonus.row && bonus.col === currentBonus.col)
                )
            );

            const updatedMap = levelMap.map((row, rowIndex) =>
                row.map((tile, colIndex) => {
                    if (rowIndex === currentBonus.row && colIndex === currentBonus.col) {
                        return 'empty';
                    }
                    return tile;
                })
            );
            setLevelMap(updatedMap);
        }
    }, [player, bonuses, levelMap, setLevelMap]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBullets((prevBullets) =>
                prevBullets
                    .map((bullet) => {
                        let newRow = bullet.row;
                        let newCol = bullet.col;

                        switch (bullet.direction) {
                            case 'up':
                                newRow -= 1;
                                break;
                            case 'down':
                                newRow += 1;
                                break;
                            case 'left':
                                newCol -= 1;
                                break;
                            case 'right':
                                newCol += 1;
                                break;
                            default:
                                break;
                        }

                        if (levelMap[newRow] && levelMap[newRow][newCol] === 'empty') {
                            return { ...bullet, row: newRow, col: newCol };
                        }
                        return null;
                    })
                    .filter((bullet) => bullet !== null)
            );
        }, 100);

        return () => clearInterval(interval);
    }, [levelMap]);

    return (
        <>
            {levelMap.map((row, rowIndex) =>
                row.map((tile, colIndex) => {
                    if (tile === 'bush') return null;
                    return (
                        <Tile
                            key={`${rowIndex}-${colIndex}`}
                            type={tile}
                            style={{
                                position: 'absolute',
                                left: `${colIndex * 32}px`,
                                top: `${rowIndex * 32}px`,
                                width: '32px',
                                height: '32px',
                            }}
                        />
                    );
                })
            )}
            <Tile
                type={`enemy_A`}
                style={{
                    position: 'absolute',
                    left: `${player.col * 32}px`,
                    top: `${player.row * 32}px`,
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'blue',
                    transform: getRotation(player.direction),
                }}
            />
            {bullets.map((bullet, index) => (
                <Bullet key={index} bullet={bullet} />
            ))}
            {explosions.map((explosion, index) => (
                <Explosion key={index} explosion={explosion} />
            ))}
        </>
    );
};

export default Player;
