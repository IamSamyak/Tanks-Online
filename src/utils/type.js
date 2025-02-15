// type.js

// Enum for Sprite Types
export const SpriteType = Object.freeze({
    ST_TANK_A: 'ST_TANK_A',
    ST_TANK_B: 'ST_TANK_B',
    ST_TANK_C: 'ST_TANK_C',
    ST_TANK_D: 'ST_TANK_D',
    ST_PLAYER_1: 'ST_PLAYER_1',
    ST_PLAYER_2: 'ST_PLAYER_2',
    ST_BRICK_WALL: 'ST_BRICK_WALL',
    ST_STONE_WALL: 'ST_STONE_WALL',
    ST_WATER: 'ST_WATER',
    ST_BUSH: 'ST_BUSH',
    ST_ICE: 'ST_ICE',
    ST_BONUS_GRENADE: 'ST_BONUS_GRENADE',
    ST_BONUS_HELMET: 'ST_BONUS_HELMET',
    ST_BONUS_CLOCK: 'ST_BONUS_CLOCK',
    ST_BONUS_SHOVEL: 'ST_BONUS_SHOVEL',
    ST_BONUS_TANK: 'ST_BONUS_TANK',
    ST_BONUS_STAR: 'ST_BONUS_STAR',
    ST_BONUS_GUN: 'ST_BONUS_GUN',
    ST_BONUS_BOAT: 'ST_BONUS_BOAT',
    ST_SHIELD: 'ST_SHIELD',
    ST_CREATE: 'ST_CREATE',
    ST_DESTROY_TANK: 'ST_DESTROY_TANK',
    ST_DESTROY_BULLET: 'ST_DESTROY_BULLET',
    ST_BOAT_P1: 'ST_BOAT_P1',
    ST_BOAT_P2: 'ST_BOAT_P2',
    ST_EAGLE: 'ST_EAGLE',
    ST_DESTROY_EAGLE: 'ST_DESTROY_EAGLE',
    ST_FLAG: 'ST_FLAG',
    ST_BULLET: 'ST_BULLET',
    ST_LEFT_ENEMY: 'ST_LEFT_ENEMY',
    ST_STAGE_STATUS: 'ST_STAGE_STATUS',
    ST_TANKS_LOGO: 'ST_TANKS_LOGO',
    ST_NONE: 'ST_NONE'
});

// Enum for Tank State Flags
export const TankStateFlag = Object.freeze({
    TSF_SHIELD: 1 << 1,    // Shield after taking helmet
    TSF_FROZEN: 1 << 2,    // Frozen after enemy takes clock
    TSF_DESTROYED: 1 << 3, // Destroyed by enemy's bomb or hit by bullet
    TSF_BOAT: 1 << 4,      // Can cross water after taking boat
    TSF_BONUS: 1 << 5,     // Bonus appears on map after hitting this tank
    TSF_ON_ICE: 1 << 6,    // Slips on ice
    TSF_CREATE: 1 << 7,    // Creating tank
    TSF_LIFE: 1 << 8,
    TSF_MENU: 1 << 9       // Double animation speed
});

// Enum for Directions
export const Direction = Object.freeze({
    D_UP: 0,
    D_RIGHT: 1,
    D_DOWN: 2,
    D_LEFT: 3
});
