// utils/actions.js
export const shoot = (player, levelMap, setLevelMap, setBullets, setExplosions) => {
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

    // Check for initial collision
    if ((tile1 && tile1 !== 'empty') || (tile2 && tile2 !== 'empty')) {
        setExplosions((prev) => [...prev, { row: bulletRow, col: bulletCol }]);
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
        setBullets((prev) => [
            ...prev,
            { row: bulletRow, col: bulletCol, direction: player.direction },
        ]);
    }
};
