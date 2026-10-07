var enemyArray = {red: {src: initImage("enemies/redMouse.png"), spawn: null, speed: 1}}
var enemyStats =  []
var enemySpawnArray = [
    //Round 1
    [
        {type: enemyArray["red"], inBetweenTime: 60, amount:10}
    ]
]
var gameIsStillPlaying = true;