var enemyArray = {red: {src: initImage("enemies/redMouse.png"), spawn: null, speed: 1}}
var enemyStats =  []
var enemySpawnArray = [
    // Round 1 (Index 0)
    [
        {type: enemyArray["red"], inBetweenTime: 120, amount: 10},
        {type: enemyArray["red"], inBetweenTime: 60, amount: 15}
    ],
    // Round 2 (Index 1)
    [
        {type: enemyArray["red"], inBetweenTime: 80, amount: 20},
        {type: enemyArray["red"], inBetweenTime: 40, amount: 20}
    ],
    // Round 3 (Index 2)
    [
        {type: enemyArray["red"], inBetweenTime: 30, amount: 50}
    ]
];
var gameIsStillPlaying = true;