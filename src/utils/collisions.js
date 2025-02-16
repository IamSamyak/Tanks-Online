// utils.js
export const checkBonusCollision = (bonus, player) => {
    if (bonus) {
        const { row: bonusRow, col: bonusCol } = bonus;

        // Check all four corners of the tank
        if (
            (player.row === bonusRow && player.col === bonusCol) || // Top-left
            (player.row === bonusRow && player.col + 1 === bonusCol) || // Top-right
            (player.row + 1 === bonusRow && player.col === bonusCol) || // Bottom-left
            (player.row + 1 === bonusRow && player.col + 1 === bonusCol) // Bottom-right
        ) {
            console.log('Bonus collected:', bonus.type);
            // You can also add any logic here to update score, remove bonus from the map, etc.
        }
    }
};

export const handleBulletCollision = (bullet, levelMap, setLevelMap, setExplosions) => {
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

    let tile1, tile2;
    switch (bullet.direction) {
        case 'up':
        case 'down':
            tile1 = levelMap[newRow] ? levelMap[newRow][bullet.col] : null;
            tile2 = levelMap[newRow] ? levelMap[newRow][bullet.col + 1] : null;
            break;
        case 'left':
        case 'right':
            tile1 = levelMap[bullet.row] ? levelMap[bullet.row][newCol] : null;
            tile2 = levelMap[bullet.row + 1] ? levelMap[bullet.row + 1][newCol] : null;
            break;
        default:
            break;
    }

    if ((tile1 && tile1 !== 'empty') || (tile2 && tile2 !== 'empty')) {
        setExplosions((prev) => [...prev, { row: newRow, col: newCol }]);
        const updatedMap = levelMap.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
                if (
                    (rowIndex === newRow && colIndex === bullet.col) ||
                    (rowIndex === newRow && colIndex === bullet.col + 1) ||
                    (rowIndex === bullet.row && colIndex === newCol) ||
                    (rowIndex === bullet.row + 1 && colIndex === newCol)
                ) {
                    return 'empty';
                }
                return tile;
            })
        );
        setLevelMap(updatedMap);

        return null;
    }

    if (levelMap[newRow] && levelMap[newRow][newCol] === 'empty') {
        return { ...bullet, row: newRow, col: newCol };
    }

    return null;
};
