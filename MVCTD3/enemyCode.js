//Enemy array for spawning
var enemyArray = {
    red: { src: initImage("enemies/redMouse.png"), spawn: [null], speed: 1, hpToDrain: 1, type: "red"},
    orange: { src: initImage("enemies/orangeMouse.png"), spawn: [], speed: 1.25, hpToDrain: 2, type: "orange"},
    yellow: { src: initImage("enemies/yellowMouse.png"), spawn: [], speed: 1.5,  hpToDrain: 3, type: "yellow"},
    green: { src: initImage("enemies/greenMouse.png"), spawn: [], speed: 1.75,  hpToDrain: 4, type: "green"},
    lBlue: { src: initImage("enemies/lBlueMouse.png"), spawn: [], speed: 2,  hpToDrain: 5, type: "lBlue"},
    dBlue: {src: initImage("enemies/dBlueMouse.png"), spawn: [], speed: 2.5,  hpToDrain: 11, type: "dBlue"},
    purple: {src: initImage("enemies/purple.png"), spawn: [], speed: 2,  hpToDrain: 23, type: "purple"},
    pink: {src: initImage("enemies/pinkMouse.png"), spawn: [], speed: 3,  hpToDrain: 25, type: "pink"},
    white: {src: initImage("enemies/whiteMouse.png"), spawn: [], speed: 1.5,  hpToDrain: 41, type: "white"},
    grey: {src: initImage("enemies/greyMouse.png"), spawn: [], speed: 2,  hpToDrain: 124, type: "grey"},
    rainbow: {src: initImage("enemies/rainbowMouse.png"), spawn: [], speed: 1.75,  hpToDrain: 239, type: "rainbow"},
    brown: {src: initImage("enemies/brownMouse.png"), spawn: [], speed: 0.8, hpToDrain: 718, type: "brown"},
    boss1: {src: initImage("enemies/normalBoss.png"), spawn: [], speed: 0.25, hpToDrain: 3946, type: "boss1"}
};

//Setup nesting info
enemyArray.orange.spawn = [enemyArray.red];
enemyArray.yellow.spawn = [enemyArray.orange];
enemyArray.green.spawn = [enemyArray.yellow];
enemyArray.lBlue.spawn = [enemyArray.green];
enemyArray.dBlue.spawn = [enemyArray.lBlue, enemyArray.lBlue];
enemyArray.purple.spawn = [enemyArray.dBlue, enemyArray.dBlue];
enemyArray.pink.spawn = [enemyArray.purple, enemyArray.red];
enemyArray.white.spawn = [enemyArray.pink, enemyArray.green, enemyArray.dBlue];
enemyArray.grey.spawn = [enemyArray.white, enemyArray.white, enemyArray.white];
enemyArray.rainbow.spawn = [enemyArray.grey, enemyArray.white, enemyArray.pink, enemyArray.purple, enemyArray.dBlue, enemyArray.lBlue, enemyArray.green, enemyArray.yellow, enemyArray.orange, enemyArray.red];
enemyArray.brown.spawn = [enemyArray.rainbow, enemyArray.rainbow, enemyArray.rainbow];
enemyArray.boss1.spawn = [enemyArray.brown, enemyArray.brown, enemyArray.brown, enemyArray.brown, enemyArray.brown];
var rmeSpawn = [enemyArray.red, enemyArray.orange, enemyArray.yellow, enemyArray.green, enemyArray.lBlue, enemyArray.dBlue, enemyArray.purple, enemyArray.pink, enemyArray.white, enemyArray.grey, enemyArray.rainbow, enemyArray.brown, enemyArray.boss1];
//Enemy array for each
var enemyStats = [];


//Round stats
var enemySpawnArray = [
    [//1
        { type: enemyArray.red, inBetweenTime: 120, amount: 10 }
    ],
    [//2
        { type: enemyArray.red, inBetweenTime: 80, amount: 20 }
    ],
    [//3
        { type: enemyArray.red, inBetweenTime: 30, amount: 50 }
    ],
    [//4
        { type: enemyArray.orange, inBetweenTime: 90, amount: 10 }
    ],
    [//5
        {type: enemyArray.orange, inBetweenTime: 45, amount: 25}
    ],
    [//6
        {type: enemyArray.yellow, inBetweenTime: 60, amount: 8}
    ],
    [//7
        {type: enemyArray.red, inBetweenTime: 30, amount: 20},
        {type: enemyArray.orange, inBetweenTime: 20, amount: 20},
        {type: enemyArray.red, inBetweenTime: 10, amount: 20}
    ],
    [//8
        {type: enemyArray.yellow, inBetweenTime: 60, amount: 60}
    ],
    [//9
        {type: enemyArray.green, inBetweenTime: 120, amount: 5}
    ],
    [//10
        {type: enemyArray.green, inBetweenTime: 25, amount: 5},
        {type: enemyArray.red, inBetweenTime: 1, amount: 1},
        {type: enemyArray.green, inBetweenTime: 25, amount: 4}
    ],
    [//11
        {type: enemyArray.green, inBetweenTime: 60, amount: 20}

    ],
    [//12
        {type: enemyArray.lBlue, inBetweenTime: 90, amount: 5}
    ],
    [//13
        {type: enemyArray.lBlue, inBetweenTime: 90, amount: 10},
        {type: enemyArray.yellow, inBetweenTime: 60, amount: 10},
        {type: enemyArray.lBlue, inBetweenTime: 90, amount: 10}
    ],
    [//14
        {type: enemyArray.red, inBetweenTime: 10, amount: 100}
    ],
    [//15
        {type: enemyArray.dBlue, inBetweenTime: 120, amount: 3}
    ],
    [//16
        {type: enemyArray.dBlue, inBetweenTime: 120, amount: 20}
    ],
    [//17
        {type: enemyArray.dBlue, inBetweenTime: 75, amount: 25}
    ],
    [//18
        {type: enemyArray.purple, inBetweenTime: 120, amount: 3}
    ],
    [//19
        {type: enemyArray.purple, inBetweenTime: 120, amount: 3},
        {type: enemyArray.dBlue, inBetweenTime: 110, amount: 3},
        {type: enemyArray.lBlue, inBetweenTime: 100, amount: 3},
        {type: enemyArray.green, inBetweenTime: 90, amount: 3},
        {type: enemyArray.yellow, inBetweenTime: 60, amount: 3},
        {type: enemyArray.orange, inBetweenTime: 30, amount: 3},
        {type: enemyArray.red, inBetweenTime: 1, amount: 3}
    ],
    [//20
        {type: enemyArray.purple, inBetweenTime: 60, amount: 25}
    ],
    [//21
        {type: enemyArray.pink, inBetweenTime: 120, amount: 3}
    ],
    [//22
        {type: enemyArray.pink, inBetweenTime: 120, amount: 10}
    ],
    [//23
        {type: enemyArray.green, inBetweenTime: 5, amount: 100}
    ],
    [//24
        {type: enemyArray.white, inBetweenTime: 60, amount: 5}
    ],
    [//25
        {type: enemyArray.purple, inBetweenTime: 30, amount: 50}
    ],
    [//26
        {type: enemyArray.white, inBetweenTime: 60, amount: 20}
    ],
    [//27
        {type: enemyArray.red, inBetweenTime: 60, amount: 50},
        {type: enemyArray.orange, inBetweenTime: 60, amount: 45},
        {type: enemyArray.yellow, inBetweenTime: 60, amount: 40},
        {type: enemyArray.green, inBetweenTime: 60, amount: 35},
        {type: enemyArray.lBlue, inBetweenTime: 60, amount: 30},
        {type: enemyArray.dBlue, inBetweenTime: 60, amount: 25},
        {type: enemyArray.purple, inBetweenTime: 60, amount: 20},
        {type: enemyArray.pink, inBetweenTime: 60, amount: 15},
        {type: enemyArray.white, inBetweenTime: 60, amount: 10},
        {type: enemyArray.red, inBetweenTime: 5, amount: 500}
    ]
];

//Update enemy info
var gameIsStillPlaying = true;
var hasSeenEachEnemy = [false, false, false, false, false, false, false, false, false, false, false, false, false];
function updateEnemyStats(){
    if(enemyStats){
        for(var i = enemyStats.length - 1; i >= 0; i--){
            var enemy = enemyStats[i];
            var nextWaypoint = path[enemy.pathAmount + 1];
            if (!nextWaypoint) {
                hp -= enemy.type.hpToDrain;
                updateProgressBar(hp);
                if(hp <= 0){alert("Out of lives! Please reload the game or click OK to automatically reload the page."); window.location.reload();}
                enemyStats.splice(i, 1); 
                continue;
            }
            if ((Math.abs(enemy.x - nextWaypoint.x)) <= Math.ceil(enemy.type.speed) && 
                (Math.abs(enemy.y - nextWaypoint.y)) <= Math.ceil(enemy.type.speed)) {
                enemy.x = nextWaypoint.x;
                enemy.y = nextWaypoint.y;
                enemy.direction = nextWaypoint.direction;
                enemy.pathAmount++;
            }
            if(enemy.direction == Math.PI){ enemy.x += enemy.type.speed; }
            else if(enemy.direction == Math.PI*0.5){ enemy.y -= enemy.type.speed; }
            else if(enemy.direction == Math.PI*1.5){ enemy.y += enemy.type.speed; }
            else if(enemy.direction == 0 || enemy.direction == Math.PI*2){ enemy.x -= enemy.type.speed; }
            if(enemy.damageTaken >= 1){
                for(var j=0; j< enemy.damageTaken; j++){
                enemy.currentHP --;
                enemy.damageTaken--;
                
                if(enemy.currentHP <= 0){
                    if(enemy.type == enemyArray.orange){
                        enemy.type = enemyArray.red;
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.yellow){
                        enemy.type = enemyArray.orange;
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.green){
                        enemy.type = enemyArray.yellow;
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.lBlue){
                        enemy.type = enemyArray.green;
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.dBlue){
                        enemy.type = enemyArray.lBlue;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"lBlue", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.purple){
                        enemy.type = enemyArray.dBlue;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"dBlue", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.pink){
                        enemy.type = enemyArray.purple;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"purple", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.white){
                        enemy.type = enemyArray.pink;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"dBlue", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"green", 1);
                        
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.grey){
                        enemy.type = enemyArray.white;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"white", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"white", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.rainbow){
                        enemy.type = enemyArray.grey;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"white", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"pink", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"purple", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"dBlue", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"lBlue", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"green", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"yellow", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"orange", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"red", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.brown){
                        enemy.type = enemyArray.rainbow;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"rainbow", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"rainbow", 1);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"rainbow", 1);
                        enemy.currentHP = 1;
                    }
                    else if(enemy.type == enemyArray.boss1){
                        enemy.type = enemyArray.brown;
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"brown", 5);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"brown", 5);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"brown", 5);
                        spawnEnemy(enemy.x,enemy.y, enemy.direction,"brown", 5);
                        enemy.currentHP = 5;
                    }
                    else{
                    enemyStats.splice(i, 1);}
                    money++;
                    break;
                }}
            }
        }
    }
}

//Start next round function
function startNextRound() {
    try{
    if (!enemySpawnArray || enemySpawnArray.length === 0) {
        error("Engine Configuration Error: enemySpawnArray database is missing or empty.");
        alert("Cannot start game: No rounds found!");
        return; 
    }

    var noEnemiesOnScreen = (!enemyStats || enemyStats.length === 0);
    if (noEnemiesOnScreen && isSpawningFinished) {
        if (window.activeRoundWaves !== undefined) {
            money += eorMoney * 50;
            var nextRoundIndex = currentRound + 1;
            if (nextRoundIndex >= enemySpawnArray.length) {
                if(hasSeenEndlessModeAlert != true){
                warn("Game completed! No further rounds are defined inside the spawn tracking index.");
                alert("You won! Reload the page to retry the demo again. OR keep playing to unlock ENDLESS MODE, where the enemies get randomized each round and become more and more later on! That's fun!");hasSeenEndlessModeAlert = true;}
                var rme = 25*1.15 ** currentRound;
                enemySpawnArray.push([]);
                while(rme > 0){
                    var affordableEnemies = rmeSpawn.filter(function(e) { return e.hpToDrain <= this; }, rme);
                    if (affordableEnemies.length === 0) {
                    break;
                    }
                    var randomEnemy = affordableEnemies[Math.floor(Math.random() * affordableEnemies.length)];
                    enemySpawnArray[nextRoundIndex].push({
                    type: randomEnemy,
                    inBetweenTime: getRandomNumber(120),
                    amount: 1
                    });
                    rme -= randomEnemy.hpToDrain;
                }
            }
            
            currentRound = nextRoundIndex;
        }
            var currentRoundConfigOrigin = enemySpawnArray[currentRound];
            
            if (!currentRoundConfigOrigin || !Array.isArray(currentRoundConfigOrigin)) {
                throw new Error("Target round dataset is structurally corrupt or undefined.");
            }
            window.activeRoundWaves = currentRoundConfigOrigin.map(wave => {
                return {
                    type: wave.type,               
                    inBetweenTime: wave.inBetweenTime,
                    amount: wave.amount
                };
            });
            isSpawningFinished = false;
            framesToSpawn = 0;
            var roundLabel = gebid("roundDisplay");
            if (roundLabel) {
                roundLabel.textContent = "Round: " + (currentRound + 1);
            }
    } else {
        warn("Action Prevented: You must clear remaining field elements before initiating standard loop sequence transitions!");
    }
    }
    catch(error){
        error("Error in spawning enemies: " + error);
    }
}

//Enemy spawning function
function updateEnemySpawning() {
    if (isSpawningFinished || !window.activeRoundWaves) {
        isSpawningFinished = true;
        return;
    }
    var activeWaves = window.activeRoundWaves;

    if (activeWaves.length > 0 && activeWaves[0].amount === 0) {
        activeWaves.splice(0, 1);
        framesToSpawn = 0; 
    }

    if (activeWaves.length === 0) {
        isSpawningFinished = true;
        return;
    }
    if (framesToSpawn >= activeWaves[0].inBetweenTime && activeWaves[0].amount > 0) {
        if(getSaves("mvctd3-settings").showTutorial == true){
        if(activeWaves[0].type == enemyArray.red && hasSeenEachEnemy[0] == false){ hasSeenEachEnemy[0] = true; alert("Red Enemy: \n This is the basic enemy you will see throught the game. Place a tower down to defend off the enemies. \n You can do this by pressing lowercase t on your keyboard or clicking the cat image in the right menu. Happy playing! \n -The MVCTD3 Dev Team");}
        if(activeWaves[0].type == enemyArray.orange && hasSeenEachEnemy[1] == false){hasSeenEachEnemy[1] = true; alert("Orange Enemy: \n This is the best time to tell you about an important topic: \n NESTING. \n In this case, dealing damage to an orange enemy does not kill it, but instead spawns a red enemy in its place.\n This will become more prominent during the later rounds, as some enemies may have more than one enemy inside them (hint hint).");}
        if(activeWaves[0].type == enemyArray.yellow && hasSeenEachEnemy[2] == false){hasSeenEachEnemy[2] = true; alert("Yellow Enemy: \n This is just like the orange enemy in that it has the enemy below it (in this case an orange enemy). \n Also, the enemies become a little faster the stronger they are (up to a point, where it becomes almost random).");}
        if(activeWaves[0].type == enemyArray.green && hasSeenEachEnemy[3] == false){hasSeenEachEnemy[3] = true; alert("Green Enemy: \n Yep, it's this again. This guy is even faster and has a yellow enemy inside. \n Yes, there is some differences later on, so be quiet.");}
        if(activeWaves[0].type == enemyArray.lBlue && hasSeenEachEnemy[4] == false){hasSeenEachEnemy[4] = true; alert("Light Blue enemy: \n Yeah, what did you thing was gonna happen? \n At least the next one is somewhat different... \n Also, this implies there is a dark blue enemy, so stay tuned!");}
        if(activeWaves[0].type == enemyArray.dBlue && hasSeenEachEnemy[5] == false){hasSeenEachEnemy[5] = true; alert("Dark Blue Enemy: \n Yay! Something different! \n In this case, this Dark Blue enemy has not one, but two light blue enemies inside it! \n This makes it way more damgerous than anything else you've seen yet!\n Get ready!");}
        if(activeWaves[0].type == enemyArray.purple && hasSeenEachEnemy[6] == false){ hasSeenEachEnemy[6] = true; alert("Purple Enemy: \n Yes, this has two dark bluies inside, but it is slower than the dark blue enemy for some reason.");}
        if(activeWaves[0].type == enemyArray.pink && hasSeenEachEnemy[7] == false){hasSeenEachEnemy[7] = true; alert("Pink Enemy: \n Also something different. It is way too fast for this game (I had to edit the code because it kept flying off the track),\n and this has a purple and a ... red enemy inside?\nYeah, I wanted to be different.");}
        if(activeWaves[0].type == enemyArray.white && hasSeenEachEnemy[8] == false){hasSeenEachEnemy[8] = true; alert("White Enemy: \n This has a pink, a green, and a dark blue inside for some random fun. Also this enemy cannot be stunned by light becaus eit is so bright itself. \n This currently does nothing, but evantually it will do something.");}
        if(activeWaves[0].type == enemyArray.grey && hasSeenEachEnemy[9] == false){hasSeenEachEnemy[9] = true; alert("After White comes...: \n Grey? Yeah, I don't know what I was thinking with this one. It has THREE whites inside it for some reason. \n Ramping in this game is insane fr fr.");}
        if(activeWaves[0].type == enemyArray.rainbow && hasSeenEachEnemy[10] == false){hasSeenEachEnemy[10] = true; alert("Rainbow Enemy: \n Yeah, this STILL is not the black one. \n But it has literally one of eveny enemy below it. Why? I don't know either! \n :)");}
        if(activeWaves[0].type == enemyArray.brown && hasSeenEachEnemy[11] == false){hasSeenEachEnemy[11] = true; alert("Brown Enemy: \n No, it is not made of what you think it is, it's just dirt and rocks. But this gives it a 5 hp shield. This is nowhere from the hardest, so keep watching...");}
        if(activeWaves[0].type == enemyArray.boss1 && hasSeenEachEnemy[12] == false){hasSeenEachEnemy[12] = true; alert("Boss One: \n A HUGE spike in difficulty. \n It has 256 hp and spawns 5 browns when defeated. You'd better have your defenses ready...");}
        }
        //Set up natural HP
        var currentHP = 1;
        if(activeWaves[0].type == enemyArray.brown){currentHP = 5;}
        else if(activeWaves[0].type == enemyArray.boss1){currentHP = 256;}
        log(JSON.stringify(activeWaves[0].type.type));
        spawnEnemy(entrance.x, entrance.y, path[0].direction, activeWaves[0].type.type, currentHP);
        framesToSpawn = 0;
        activeWaves[0].amount -= 1;
    }
    framesToSpawn++;
}

//Spawn an enemy function
function spawnEnemy(x,y,direction,type, currentHP){
    enemyStats.push({
        type: enemyArray[type],
            currentHP:currentHP,
            x: x,
            y: y,
            damageTaken:0,
            pathAmount: 0,
            distanceTraveled: 0,
            id: ++enemySpawnedIDs,
            direction: direction
        
    });
}