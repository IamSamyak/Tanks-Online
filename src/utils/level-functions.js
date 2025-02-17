// level-functions.js

export const loadLevel = async (levelNumber, tileMapping, NUM_ENEMIES, spawnEnemies, spawnBonus) => {
    try {
      const response = await fetch(`/levels/${levelNumber}.txt`);
      const text = await response.text();
      const rows = text.split('\n').filter(row => row.trim().length > 0);
      const maxLength = Math.max(...rows.map(row => row.length));
      const normalizedRows = rows.map(row => row.padEnd(maxLength, '.').split(''));
      const tiles = [];
      const emptyTiles = [];
  
      normalizedRows.forEach((row, rowIndex) => {
        const tileRow = [];
        row.forEach((char, colIndex) => {
          if (char === '.') {
            emptyTiles.push({ col: colIndex, row: rowIndex });
          }
          tileRow.push(tileMapping[char] || 'empty');
        });
        tiles.push(tileRow);
      });
  
      // Set enemies at random positions using spawnEnemies
      const tempEnemies = spawnEnemies(emptyTiles, NUM_ENEMIES);
  
      return { tiles, tempEnemies };
    } catch (error) {
      console.error('Failed to load level:', error);
    }
  };
  