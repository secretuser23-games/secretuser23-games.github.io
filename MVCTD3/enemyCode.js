var enemyArray = {red: {src: initImage("enemies/redMouse.png"), spawn: null, speed: 1}}
var enemyStats = [{codeName: "testEnemy", x: entrance["x"], y: entrance["y"], type: enemyArray["red"], id:0, direction: Math.PI, pathAmount:0, distanceTraveled: 0}, {codeName: "testEnemy2", x: entrance["x"]-100, y: entrance["y"], type: enemyArray["red"], id:1, direction: Math.PI, pathAmount:0, distanceTraveled: 0}]
var enemySpawnArray = [
    //Round 1
    [
        {type: enemyArray["red"], inBetweenTime: 60, amount:10}
    ]
]
var gameIsStillPlaying = true;