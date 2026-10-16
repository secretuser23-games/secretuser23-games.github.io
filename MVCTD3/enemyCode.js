var enemyArray = {
    red: { src: initImage("enemies/redMouse.png"), spawn: [null], speed: 1, hpToDrain: 1},
    orange: { src: initImage("enemies/orangeMouse.png"), spawn: [], speed: 1.25, hpToDrain: 2},
    yellow: { src: initImage("enemies/yellowMouse.png"), spawn: [], speed: 1.5,  hpToDrain: 3},
    green: { src: initImage("enemies/greenMouse.png"), spawn: [], speed: 1.75,  hpToDrain: 4},
    lBlue: { src: initImage("enemies/lBlueMouse.png"), spawn: [], speed: 2,  hpToDrain: 5},
    dBlue: {src: initImage("enemies/dBlueMouse.png"), spawn: [], speed: 2.5,  hpToDrain: 11},
    purple: {src: initImage("enemies/purple.png"), spawn: [], speed: 2,  hpToDrain: 23},
    pink: {src: initImage("enemies/pinkMouse.png"), spawn: [], speed: 3,  hpToDrain: 25},
    white: {src: initImage("enemies/whiteMouse.png"), spawn: [], speed: 1.5,  hpToDrain: 41},
    grey: {src: initImage("enemies/greyMouse.png"), spawn: [], speed: 2,  hpToDrain: 124},
    rainbow: {src: initImage("enemies/rainbowMouse.png"), spawn: [], speed: 1.75,  hpToDrain: 239},
    brown: {src: initImage("enemies/brownMouse.png"), spawn: [], speed: 0.8, hpToDrain: 718}
};
enemyArray.orange.spawn = [enemyArray.red];
enemyArray.yellow.spawn = [enemyArray.orange];
enemyArray.green.spawn = [enemyArray.yellow];
enemyArray.lBlue.spawn = [enemyArray.green];
enemyArray.dBlue.spawn = [enemyArray.lBlue, enemyArray.lBlue]
enemyArray.purple.spawn = [enemyArray.dBlue, enemyArray.dBlue]
enemyArray.pink.spawn = [enemyArray.purple, enemyArray.red]
enemyArray.white.spawn = [enemyArray.pink, enemyArray.green, enemyArray.dBlue]
enemyArray.grey.spawn = [enemyArray.white, enemyArray.white, enemyArray.white]
enemyArray.rainbow.spawn = [enemyArray.grey, enemyArray.white, enemyArray.pink, enemyArray.purple, enemyArray.dBlue, enemyArray.lBlue, enemyArray.green, enemyArray.yellow, enemyArray.orange, enemyArray.red]
enemyArray.brown.spawn = [enemyArray.rainbow, enemyArray.rainbow, enemyArray.rainbow]
var enemyStats = [];

var enemySpawnArray = [
    [//1
        { type: enemyArray["red"], inBetweenTime: 120, amount: 10 }
    ],
    [//2
        { type: enemyArray["red"], inBetweenTime: 80, amount: 20 }
    ],
    [//3
        { type: enemyArray["red"], inBetweenTime: 30, amount: 50 }
    ],
    [//4
        { type: enemyArray["orange"], inBetweenTime: 90, amount: 10 }
    ],
    [//5
        {type: enemyArray["orange"], inBetweenTime: 45, amount: 25}
    ],
    [//6
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 8}
    ],
    [//7
        {type: enemyArray["red"], inBetweenTime: 30, amount: 20},
        {type: enemyArray["orange"], inBetweenTime: 20, amount: 20},
        {type: enemyArray["red"], inBetweenTime: 10, amount: 20}
    ],
    [//8
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 60}
    ],
    [//9
        {type: enemyArray["green"], inBetweenTime: 120, amount: 5}
    ],
    [//10
        {type: enemyArray["green"], inBetweenTime: 25, amount: 5},
        {type: enemyArray["red"], inBetweenTime: 1, amount: 1},
        {type: enemyArray["green"], inBetweenTime: 25, amount: 4}
    ],
    [//11
        {type: enemyArray["green"], inBetweenTime: 60, amount: 20}

    ],
    [//12
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 5}
    ],
    [//13
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 10},
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 10},
        {type: enemyArray["lBlue"], inBetweenTime: 90, amount: 10}
    ],
    [//14
        {type: enemyArray["red"], inBetweenTime: 10, amount: 100}
    ],
    [//15
        {type: enemyArray["dBlue"], inBetweenTime: 120, amount: 3}
    ],
    [//16
        {type: enemyArray["dBlue"], inBetweenTime: 120, amount: 20}
    ],
    [//17
        {type: enemyArray["dBlue"], inBetweenTime: 75, amount: 25}
    ],
    [//18
        {type: enemyArray["purple"], inBetweenTime: 120, amount: 3}
    ],
    [//19
        {type: enemyArray["purple"], inBetweenTime: 120, amount: 3},
        {type: enemyArray["dBlue"], inBetweenTime: 110, amount: 3},
        {type: enemyArray["lBlue"], inBetweenTime: 100, amount: 3},
        {type: enemyArray["green"], inBetweenTime: 90, amount: 3},
        {type: enemyArray["yellow"], inBetweenTime: 60, amount: 3},
        {type: enemyArray["orange"], inBetweenTime: 30, amount: 3},
        {type: enemyArray["red"], inBetweenTime: 1, amount: 3}
    ],
    [//20
        {type: enemyArray["purple"], inBetweenTime: 60, amount: 25}
    ],
    [//21
        {type: enemyArray["pink"], inBetweenTime: 120, amount: 3}
    ],
    [//22
        {type: enemyArray["pink"], inBetweenTime: 120, amount: 10}
    ],
    [//23
        {type: enemyArray["green"], inBetweenTime: 5, amount: 100}
    ],
    [//24
        {type: enemyArray["white"], inBetweenTime: 60, amount: 5}
    ],
    [
        {type: enemyArray["purple"], inBetweenTime: 30, amount: 50}
    ]
];

var gameIsStillPlaying = true;
var hasSeenEachEnemy = [false, false, false, false, false, false, false, false, false, false, false, false]