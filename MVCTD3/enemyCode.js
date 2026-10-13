var enemyArray = {
    red: { src: initImage("enemies/redMouse.png"), spawn: [null], speed: 1 },
    orange: { src: initImage("enemies/orangeMouse.png"), spawn: [], speed: 1.25 },
    yellow: { src: initImage("enemies/yellowMouse.png"), spawn: [], speed: 1.5 },
    green: { src: initImage("enemies/greenMouse.png"), spawn: [], speed: 1.75 }
};
enemyArray.orange.spawn = [enemyArray.red];
enemyArray.yellow.spawn = [enemyArray.orange];
enemyArray.green.spawn = [enemyArray.yellow];
var enemyStats = [];

var enemySpawnArray = [
    // Round 1
    [
        { type: enemyArray["red"], inBetweenTime: 120, amount: 10 }
    ],
    // Round 2
    [
        { type: enemyArray["red"], inBetweenTime: 80, amount: 20 }
    ],
    // Round 3
    [
        { type: enemyArray["red"], inBetweenTime: 30, amount: 50 }
    ],
    // Round 4
    [
        { type: enemyArray["orange"], inBetweenTime: 90, amount: 10 }
    ],
    [
        {type: enemyArray["orange"], inBetweenTime: 45, amount: 25}
    ],
    [
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 8}
    ]
];

var gameIsStillPlaying = true;
var hasSeenEachEnemy = [false, false, false, false, false]