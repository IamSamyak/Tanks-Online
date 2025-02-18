// game-constants.js

export const tileMapping = {
    '.': 'empty',
    '#': 'brick',
    '@': 'stone',
    '%': 'bush',
    '~': 'water',
    '-': 'ice',
  };

  export const shieldCordinates = [
    { row: 24, col: 11 },
    { row: 25, col: 11 },
    { row: 23, col: 11 },
    { row: 24, col: 14 },
    { row: 25, col: 14 },
    { row: 23, col: 14 },
    { row: 23, col: 13 },
    { row: 23, col: 12 }
  ];
  
  
  export const bonusTypes = ['grenade', 'helmet', 'clock', 'shovel', 'tank', 'star', 'gun', 'boat'];

  export const speedBuffer = {
      low: 200,     // Slow speed
      medium: 150,  // Medium speed
      high: 75      // High speed
    };
  