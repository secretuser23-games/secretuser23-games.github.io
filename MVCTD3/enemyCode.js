var enemyArray = {
    red: { src: initImage("enemies/redMouse.png"), spawn: [null], speed: 1 },
    orange: { src: initImage("enemies/orangeMouse.png"), spawn: [], speed: 1.25 },
    yellow: { src: initImage("enemies/yellowMouse.png"), spawn: [], speed: 1.5 },
    green: { src: initImage("enemies/greenMouse.png"), spawn: [], speed: 1.75 },
    lBlue: { src: initImage("enemies/lBlueMouse.png"), spawn: [], speed: 2 },
    dBlue: {src: initImage("enemies/dBlueMouse.png"), spawn: [], speed: 2.5}
};
enemyArray.orange.spawn = [enemyArray.red];
enemyArray.yellow.spawn = [enemyArray.orange];
enemyArray.green.spawn = [enemyArray.yellow];
enemyArray.lBlue.spawn = [enemyArray.green];
enemyArray.dBlue.spawn = [enemyArray.lBlue, enemyArray.lBlue]
var enemyStats = [];

var enemySpawnArray = [
    [
        { type: enemyArray["red"], inBetweenTime: 120, amount: 10 }
    ],
    [
        { type: enemyArray["red"], inBetweenTime: 80, amount: 20 }
    ],
    [
        { type: enemyArray["red"], inBetweenTime: 30, amount: 50 }
    ],
    [
        { type: enemyArray["orange"], inBetweenTime: 90, amount: 10 }
    ],
    [
        {type: enemyArray["orange"], inBetweenTime: 45, amount: 25}
    ],
    [
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 8}
    ],
    [
        {type: enemyArray["red"], inBetweenTime: 30, amount: 20},
        {type: enemyArray["orange"], inBetweenTime: 20, amount: 20},
        {type: enemyArray["red"], inBetweenTime: 10, amount: 20}
    ],
    [
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 60}
    ],
    [
        {type: enemyArray["green"], inBetweenTime: 120, amount: 5}
    ],
    [
        {type: enemyArray["green"], inBetweenTime: 25, amount: 5},
        {type: enemyArray["red"], inBetweenTime: 1, amount: 1},
        {type: enemyArray["green"], inBetweenTime: 25, amount: 4}
    ],
    [
        {type: enemyArray["green"], inBetweenTime: 60, amount: 20}

    ],
    [
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 5}
    ],
    [
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 10},
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 10},
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 10}
    ],
    [
        {type: enemyArray["red"], inBetweenTime: 10, amount: 100}
    ],
    [
        {type: enemyArray["dBlue"], inBetweenTime: 120, amount: 3}
    ]
];

var gameIsStillPlaying = true;
var hasSeenEachEnemy = [false, false, false, false, false, false]