var enemyArray = {red: {src: initImage("enemies/redMouse.png"), spawn: null, speed: 1}}
var enemyStats =  [{type:enemyArray["red"],x: entrance["x"],y: entrance["y"],pathAmount:0,distanceTraveled:0,id:0,direction:Math.PI}]
var enemySpawnArray = [
    //Round 1
    [
        {type: enemyArray["red"], inBetweenTime: 60, amount:10}
    ]
]
var gameIsStillPlaying = true;