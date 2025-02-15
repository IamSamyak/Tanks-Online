// AppConfig.js

export const AppConfig = {
    texturePath: 'texture.png',
    levelsPath: 'levels/',
    fontName: 'prstartk.ttf',
    gameOverText: 'GAME OVER',
    mapRect: { x: 0, y: 0, w: 26 * 16, h: 26 * 16 },
    statusRect: { x: 26 * 16, y: 0, w: 3 * 16, h: 26 * 16 },
    windowRect: { x: 0, y: 0, w: (26 * 16) + (3 * 16), h: 26 * 16 },
    tileRect: { x: 0, y: 0, w: 16, h: 16 },
    playerStartingPoints: [
        { x: 128, y: 384 },
        { x: 256, y: 384 }
    ],
    enemyStartingPoints: [
        { x: 1, y: 1 },
        { x: 192, y: 1 },
        { x: 384, y: 1 }
    ],
    playerKeys: [
        { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', fire: 'RightControl' },
        { up: 'W', down: 'S', left: 'A', right: 'D', fire: 'LeftControl' }
    ],
    levelStartTime: 2000,
    slipTime: 380,
    enemyStartCount: 20,
    enemyReadyTime: 500,
    playerBulletMaxSize: 2,
    scoreShowTime: 3000,
    bonusShowTime: 10000,
    tankShieldTime: 10000,
    tankFrozenTime: 8000,
    levelEndTime: 5000,
    protectEagleTime: 15000,
    bonusBlinkTime: 350,
    playerReloadTime: 120,
    enemyMaxCountOnMap: 4,
    gameOverEntrySpeed: 0.13,
    tankDefaultSpeed: 0.08,
    bulletDefaultSpeed: 0.23,
    showEnemyTarget: false
};
