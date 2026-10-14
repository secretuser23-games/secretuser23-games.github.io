function gebid(id) {
    return document.getElementById(id);
}

function log(message) {
    var logsDiv = gebid("logs");
    if(logsDiv) {
        var logEntry = document.createElement("p");
        logEntry.textContent = message;
        logsDiv.appendChild(logEntry);
    }
}

function warn(message){
    var logsDiv = gebid("logs");
    if(logsDiv) {
        var logEntry = document.createElement("p");
        logEntry.textContent = message;
        logEntry.style.color = "yellow";
        logEntry.style.backgroundColor = "black"
        logsDiv.appendChild(logEntry);
    }
}

function error(message){
    var logsDiv = gebid("logs");
    if(logsDiv) {
        var logEntry = document.createElement("p");
        logEntry.textContent = message;
        logEntry.style.color = "red";
        logEntry.style.backgroundColor = "black"
        logsDiv.appendChild(logEntry);
    }
}
function clearLogs(){
    gebid("logs").innerHTML = "<p class='top'></p><p id='fpsCounter'>FPS: 0."
}
var loading = 0;
var selectedTower = null;
var towerOpenedID = 0;
var globalTowerID = 0;
var isPlacingTower = false;
var placementX = 0;
var placementY = 0;
var isSpawningFinished = false; 
var preSpaceSpeed = 1;
var isSpaceHeldDown = false;
var enemySpawnedIDs = 0;
var currentWave = 0;
var gameInterval = null;
var framesToSpawn = 0;
var currentSpeed = 1;
var loadingMax = 0;
var frameCount = 0;
var totalFramesRendered = 0;
var lastTime = performance.now();
var currentRound = 0;
var fps = 60;
var isGameLoopRunning = false; 

var canvas = gebid("mainGameCanvas");
var ctx = canvas ? canvas.getContext("2d") : null;
function scaleImage(wantedWidth, wantedHeight){
    if (!canvas) return [wantedWidth, wantedHeight];
    var width = wantedWidth * canvas.width / 1000;
    var height = wantedHeight * canvas.height / 1000;
    return [width, height];
}

function drawImg(image, x, y, width, height, rotation = 0) {
    if (!image || !ctx) return; 
    ctx.imageSmoothingEnabled = false;

    const [scaledW, scaledH] = scaleImage(width, height);
    const [scaledX, scaledY] = scaleImage(x, y);

    if (rotation === 0) {
        ctx.setTransform(1, 0, 0, 1, scaledX, scaledY);
        ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH); 
    } else {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        ctx.setTransform(cos, sin, -sin, cos, scaledX, scaledY);
        ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGrid(size){
    var halfTile = (1000 / size) / 2;
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            drawImg(gridImg, (i * 1000 / size) + halfTile, (j * 1000 / size) + halfTile, 1000 / size, 1000 / size);
        }
    }
}

function createArrayForGrid(rows, cols, what){
    return Array.from({ length: rows }, () => Array(cols).fill(what));
}

function drawTrack(){
    if (typeof trackInfo === 'undefined' || !trackInfo) return; 

    const tileWidth = 62.5; 
    const tileHeight = 62.5;
    const halfWidth = 31.25;

    for(var i=0; i<trackInfo.length; i++){
        if (!trackInfo[i]) continue; 

        for(var j=0; j<trackInfo[i].length; j++){
            var tile = trackInfo[i][j];
            if(tile && tile["typeTrack"] != null){
                drawImg(tile["typeTrack"], (j * tileWidth) + halfWidth, (i * tileHeight) + halfWidth, tileWidth, tileHeight);
                if(tile["trackDetails"]){
                    drawImg(tile["trackDetails"], (j * tileWidth) + halfWidth, (i * tileHeight) + halfWidth, tileWidth, tileHeight);
                }
            }
        }
    }
}
function updateEnemyStats(){
    if(enemyStats){
        for(var i = enemyStats.length - 1; i >= 0; i--){
            var enemy = enemyStats[i]
            var nextWaypoint = path[enemy["pathAmount"] + 1];
            if (!nextWaypoint) {
                enemyStats.splice(i, 1); 
                continue;
            }
            if ((Math.abs(enemy["x"] - nextWaypoint["x"])) <= Math.ceil(enemy["type"]["speed"]) && 
                (Math.abs(enemy["y"] - nextWaypoint["y"])) <= Math.ceil(enemy["type"]["speed"])) {
                enemy["x"] = nextWaypoint["x"];
                enemy["y"] = nextWaypoint["y"];
                enemy["direction"] = nextWaypoint["direction"];
                enemy["pathAmount"]++;
            }
            if(enemy["direction"] == Math.PI){ enemy["x"] += enemy["type"]["speed"]; }
            else if(enemy["direction"] == Math.PI*0.5){ enemy["y"] -= enemy["type"]["speed"]; }
            else if(enemy["direction"] == Math.PI*1.5){ enemy["y"] += enemy["type"]["speed"]; }
            else if(enemy["direction"] == 0 || enemy["direction"] == Math.PI*2){ enemy["x"] -= enemy["type"]["speed"]; }
            if(enemy["damageTaken"] >= 1){
                enemy["currentHP"] -= Math.floor(enemy["damageTaken"]);
                enemy["damageTaken"] = 0;
                
                if(enemy["currentHP"] <= 0){
                    if(enemy["type"] == enemyArray["orange"]){
                        enemy["type"] = enemyArray["red"]
                        enemy["currentHP"] = 1;
                    }
                    else if(enemy["type"] == enemyArray["yellow"]){
                        enemy["type"] = enemyArray["orange"]
                        enemy["currentHP"] = 1;
                    }
                    else if(enemy["type"] == enemyArray["green"]){
                        enemy["type"] = enemyArray["yellow"]
                        enemy["currentHP"] = 1;
                    }
                    else if(enemy["type"] == enemyArray["lBlue"]){
                        enemy["type"] = enemyArray["green"]
                        enemy["currentHP"] = 1;
                    }
                    else if(enemy["type"] == enemyArray["dBlue"]){
                        enemy["type"] = enemyArray["lBlue"];
                        enemyStats.push({
                            type: enemyArray["lBlue"],
                            currentHP: 1,
                            x: enemy["x"],
                            y: enemy["y"],
                            damageTaken:0,
                            pathAmount: enemy["pathAmount"],
                            distanceTraveled: enemy["distanceTraveled"],
                            id: ++enemySpawnedIDs,
                            direction: enemyDirection
                        })
                        enemy["currentHP"] = 1;
                    }
                    else{
                    enemyStats.splice(i, 1);}
                    continue;
                }
            }
        }
    }
}
function toggleSpeed(){
    if(currentSpeed == 1){
        currentSpeed = 2;
    }
    else{
        currentSpeed = 1;
    }
    preSpaceSpeed = currentSpeed;
    clearInterval(gameInterval)
    gameInterval = setInterval(frame, 1000/(60*currentSpeed))
}
function drawEnemies(){
    if(enemyStats){
        for(var i=0; i<enemyStats.length; i++){
            drawImg(enemyStats[i]["type"]["src"], enemyStats[i]["x"], enemyStats[i]["y"], 62.5, 62.5, enemyStats[i]["direction"])
        }
    }
}
function findDist(x1, y1, x2, y2){return Math.hypot(x2 - x1, y2 - y1);}
function startNextRound() {
    if (!enemySpawnArray || enemySpawnArray.length === 0) {
        error("Engine Configuration Error: enemySpawnArray database is missing or empty.");
        alert("Cannot start game: No rounds found!");
        return; 
    }

    var noEnemiesOnScreen = (!enemyStats || enemyStats.length === 0);
    if (noEnemiesOnScreen && isSpawningFinished) {
        if (window.activeRoundWaves !== undefined) {
            var nextRoundIndex = currentRound + 1;
            if (nextRoundIndex >= enemySpawnArray.length) {
                warn("Game completed! No further rounds are defined inside the spawn tracking index.");
                alert("You won! Reload the page to retry the demo again.");
                return; 
            }
            
            currentRound = nextRoundIndex;
        }

        try {
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
        } catch (structureException) {
            error("Engine Intercepted Fault Initialization: " + structureException.message);
            isSpawningFinished = true; 
        }

    } else {
        warn("Action Prevented: You must clear remaining field elements before initiating standard loop sequence transitions!");
    }
}
if (gebid("nextRoundButton")) {
    gebid("nextRoundButton").addEventListener("click", startNextRound);
}
function updateEnemySpawning() {
    if (isSpawningFinished || !window.activeRoundWaves) {
        isSpawningFinished = true;
        return;
    }
    var activeWaves = window.activeRoundWaves;

    if (activeWaves.length > 0 && activeWaves[0]["amount"] === 0) {
        activeWaves.splice(0, 1);
        framesToSpawn = 0; 
    }

    if (activeWaves.length === 0) {
        isSpawningFinished = true;
        return;
    }
    if (framesToSpawn >= activeWaves[0]["inBetweenTime"] && activeWaves[0]["amount"] > 0) {
        if(activeWaves[0]["type"] == enemyArray.red && hasSeenEachEnemy[0] == false){ hasSeenEachEnemy[0] = true; alert("Red Enemy: \n This is the basic enemy you will see throught the game. Place a tower down to defend off the enemies. \n You can do this by pressing lowercase t on your keyboard or clicking the cat image in the right menu. Happy playing! \n -The MVCTD3 Dev Team")}
        if(activeWaves[0]["type"] == enemyArray.orange && hasSeenEachEnemy[1] == false){hasSeenEachEnemy[1] = true; alert("Orange Enemy: \n This is the best time to tell you about an important topic: \n NESTING. \n In this case, dealing damage to an orange enemy does not kill it, but instead spawns a red enemy in its place.\n This will become more prominent during the later rounds, as some enemies may have more than one enemy inside them (hint hint).")}
        if(activeWaves[0]["type"] == enemyArray.yellow && hasSeenEachEnemy[2] == false){hasSeenEachEnemy[2] = true; alert("Yellow Enemy: \n This is just like the orange enemy in that it has the enemy below it (in this case an orange enemy). \n Also, the enemies become a little faster the stronger they are (up to a point, where it becomes almost random).")}
        if(activeWaves[0]["type"] == enemyArray.green && hasSeenEachEnemy[3] == false){hasSeenEachEnemy[3] = true; alert("Green Enemy: \n Yep, it's this again. This guy is even faster and has a yellow enemy inside. \n Yes, there is some differences later on, so be quiet.")}
        if(activeWaves[0]["type"] == enemyArray.lBlue && hasSeenEachEnemy[4] == false){hasSeenEachEnemy[4] = true; alert("Light Blue enemy: \n Yeah, what did you thing was gonna happen? \n At least the next one is somewhat different... \n Also, this implies there is a dark blue enemy, so stay tuned!")}
        if(activeWaves[0]["type"] == enemyArray.dBlue && hasSeenEachEnemy[5] == false){hasSeenEachEnemy[5] = true; alert("Dark Blue Enemy: \n Yay! Something different! \n In this case, this Dark Blue enemy has not one, but two light blue enemies inside it! \n This makes it way more damgerous than anything else you've seen yet!\n Get ready!")}
        if(activeWaves[0]["type"] == enemyArray.purple && hasSeenEachEnemy[6] == false){ hasSeenEachEnemy[6] = true; alert("Purple Enemy: \n Yes, this has two dark bluies inside, but it is slower than the dark blue enemy for some reason.")}
        if(activeWaves[0]["type"] == enemyArray.pink && hasSeenEachEnemy[7] == false){hasSeenEachEnemy[7] = true; alert("Pink Enemy: \n Also something different. It is way too fast for this game (I had to edit the code because it kept flying off the track),\n and this has a purple and a ... red enemy inside?\nYeah, I wanted to be different.")}
        if(activeWaves[0]["type"] == enemyArray.white && hasSeenEachEnemy[8] == false){hasSeenEachEnemy[8] = true; alert("White Enemy: \n This has a pink, a green, and a dark blue inside for some random fun. Also this enemy cannot be stunned by light becaus eit is so bright itself. \n This currently does nothing, but evantually it will do something.")}
        if(activeWaves[0]["type"] == enemyArray.grey && hasSeenEachEnemy[9] == false){hasSeenEachEnemy[9] = true; alert("After White comes...: \n Grey? Yeah, I don't know what I was thinking with this one. It has THREE whites inside it for some reason. \n Rampink in this game is insane fr fr.")}
        if(activeWaves[0]["type"] == enemyArray.rainbow && hasSeenEachEnemy[10] == false){hasSeenEachEnemy[10] = true; alert("Rainbow Enemy: \n Yeah, this STILL is not the black one. \n But it has literally one of eveny enemy below it. Why? I don't know either! \n :)")}
        if(activeWaves[0]["type"] == enemyArray.brown && hasSeenEachEnemy[11] == false){hasSeenEachEnemy[11] = true; alert("Brown Emeny: \n No, it is not made of what you think it is, it's just dirt and rocks. But this guy uses the power of those rocks and dirt to have a 5 HP shield, meaning you need to hit it 5 times to open the 2 rainbow mice inside.")}
        enemyStats.push({
            type: activeWaves[0]["type"],
            currentHP:1,
            x: entrance["x"],
            y: entrance["y"],
            damageTaken:0,
            pathAmount: 0,
            distanceTraveled: 0,
            id: ++enemySpawnedIDs,
            direction: Math.PI
        });
        framesToSpawn = 0;
        activeWaves[0]["amount"] -= 1;
    }
    framesToSpawn++;
}
function getAngleToTarget(imgX, imgY, targetX, targetY) {
    const dx = targetX - imgX;
    const dy = targetY - imgY;
    return Math.atan2(dy, dx);
}
function drawProjectiles(){
    if(typeof projectileList === 'undefined' || !projectileList) return;
    
    for (var i = projectileList.length - 1; i >= 0; i--) {
        var proj = projectileList[i];
        proj["x"] += Math.cos(proj["direction"]) * proj["Type"]["projSpeed"];
        proj["y"] += Math.sin(proj["direction"]) * proj["Type"]["projSpeed"];
        if (proj["x"] < -100 || proj["x"] > 1100 || proj["y"] < -100 || proj["y"] > 1100) {
            projectileList.splice(i, 1);
            continue;
        }
        drawImg(proj["Type"]["image"], proj["x"], proj["y"], 62.5, 62.5, proj["direction"]);
        var hitEnemy = false;
        for (var j = enemyStats.length - 1; j >= 0; j--) {
            var distance = findDist(proj["x"], proj["y"], enemyStats[j]["x"], enemyStats[j]["y"]);
            
            if (distance <= 62.5) {
                var dmg = proj["damage"] ? proj["damage"] : 1;
                enemyStats[j]["damageTaken"] += dmg;
                projectileList.splice(i, 1);
                hitEnemy = true;
                break;
            }
        }
        if (hitEnemy) continue;
    }
}
function createProjectile(x,y,direction,towType, level, calculatedDamage){
projectileList.push({
    Type: projectileData[towType][level],
    x: x*62.5,
    y: y*62.5,
    direction: direction,
    damage: calculatedDamage
}
)}
function checkForTargetedEnemy(towerX, towerY, targetPriority, range){
    var out = null; 
    var tPx = towerX * 62.5;
    var tPy = towerY * 62.5;

    for(var i = 0; i < enemyStats.length; i++){
        if(findDist(tPx, tPy, enemyStats[i]["x"], enemyStats[i]["y"]) <= range){
            out = i;
            break;
        }
    }
    return out;
}
function findTargetToFireAt(targetPriority, towerPixelX, towerPixelY, enemyID){
    if(enemyStats[enemyID] != undefined){
        return getAngleToTarget(towerPixelX, towerPixelY, enemyStats[enemyID]["x"], enemyStats[enemyID]["y"]);
    } else {
        return null;
    }
}
function updateTowerStats(){
    for(var i = 0; i < towerArray.length; i++){
        var tower = towerArray[i];
        drawImg(tower["type"]["image"], tower["x"] * 62.5+31.25, tower["y"] * 62.5+31.25, 62.5, 62.5, tower["direction"]);
        if (tower["reloadTime"] > 0) {
            tower["reloadTime"]--;
        }
        
        var targetedEnemy = null;
        if(enemyStats && enemyStats.length > 0){
            targetedEnemy = checkForTargetedEnemy(tower["x"], tower["y"], "first", (tower["type"]["range"] *1.25 ** tower["level"][1]));
        }
        if(targetedEnemy === null || targetedEnemy === undefined) {
            if(tower["reloadTime"] <= 0) {
                tower["reloadTime"] = 1;
            }
            continue;
        }
        var towerPixelX = tower["x"] * 62.5;
        var towerPixelY = tower["y"] * 62.5;
        var target = findTargetToFireAt("first", towerPixelX, towerPixelY, targetedEnemy);
        
        if(target !== null){
            tower["direction"] = target;
            if(tower["reloadTime"] <= 0){
                tower["reloadTime"] = tower["type"]["speed"]*0.8**tower["level"][0];
                createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1);
            }
        }
    }
}
function frame(){
    for(var l=0; l<currentSpeed; l++){
    var framePart = 0;
    frameCount++;
    totalFramesRendered++; 
    if (!ctx) return;
    
    try {
        framePart++
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        framePart++
        updateEnemySpawning();
        framePart++
        drawGrid(16);
        framePart++
        drawTrack();
        framePart++
        updateEnemyStats();
        framePart++
        drawProjectiles();
        framePart++
        drawEnemies();
        framePart++
        updateTowerStats();
        if (selectedTower) {
            ctx.beginPath();
            var centerX = (selectedTower.x * 62.5 + 31.25) * canvas.width / 1000;
            var centerY = (selectedTower.y * 62.5 + 31.25) * canvas.height / 1000;
            var rangeValue = selectedTower.type.range * (1.25 ** selectedTower.level[1]);
            var scaledRange = rangeValue * canvas.width / 1000;

            ctx.arc(centerX, centerY, scaledRange, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(0, 150, 255, 0.2)";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 150, 255, 0.6)";
            ctx.stroke();
        }
        framePart++;
        if (isPlacingTower) {
            ctx.globalAlpha = 0.6;
            drawImg(towerLists["basic"]["image"], placementX * 62.5+31.25, placementY * 62.5+31.25, 62.5, 62.5, Math.PI);
            ctx.globalAlpha = 1.0;
        }
        framePart++
    } catch (err) {
        log("Loop crashed on frame component execution: " + err.message + " at frame part " + framePart);
    }
    }
}

function reportFPS() {
    const now = performance.now();
    const duration = now - lastTime;
    const computedFps = Math.round((frameCount * 1000) / duration);
    var counter = gebid("fpsCounter");
    if(counter) counter.innerHTML = "FPS: " + computedFps + ".";
    frameCount = 0;
    lastTime = now;
    setTimeout(reportFPS, 1000);
}

function addNewScript(src){
    loadingMax++;
    var newScript = document.createElement("script");
    newScript.onload = function(){
        loading++;
        log(src + " loaded successfully.");
    };
    newScript.onerror = function() {
        loading++;
        error("Failed to load script: " + src);
    };
    newScript.src = src;
    document.body.appendChild(newScript);
}
window.initImage = function(src){
    loadingMax++;
    var out = new Image();
    
    out.onload = function(){
        loading++;
    };
    
    out.onerror = function() {
        loading++; 
        error("Failed to load image at destination path: images/" + src);
        alert("Could not find image: images/" + src + ".")
    };
    out.src = "images/" + src; 
    return out;
};
if(canvas && ctx) {
    reportFPS();
}

addNewScript("track1.js");
addNewScript("enemyCode.js")
addNewScript("towerCode.js")
addNewScript("projectiles.js")
var gridImg = window.initImage("gridSystemImage.png");
var testImage = window.initImage("ExitIndicator.png");
gebid("nextRoundButton").addEventListener("contextmenu", function(event){
    event.preventDefault();
    var skipAmount = prompt("How many rounds to skip? (Will be removed in prebeta 0.1)");
    if (skipAmount !== null && skipAmount.trim() !== "" && Number.isFinite(Number(skipAmount))) {
        for(var i=0; i< skipAmount; i++){
            currentRound++;
            isSpawningFinished = true;
            enemyStats = [];
            enemySpawnArray.splice(0,1);
        }
    }
})
gebid("speedButton").addEventListener("contextmenu", function(event) {
    preSpaceSpeed = currentSpeed; 
    event.preventDefault(); 
    var gameSpeedPrompt = prompt("How fast (1 is normal speed) do you want the game to be? Max allowed speed is 20x.");
    
    if (gameSpeedPrompt !== null && gameSpeedPrompt.trim() !== "" && Number.isFinite(Number(gameSpeedPrompt))) {
      var requestedSpeed = parseFloat(gameSpeedPrompt);
      if (requestedSpeed <= 0) {
          alert("Speed must be greater than 0!");
          return;
      }
      
      currentSpeed = Math.min(requestedSpeed, 20); 
      console.log("Game speed changed to: " + currentSpeed + "x");
      
      clearInterval(gameInterval);
      gameInterval = setInterval(frame, 1000 / 60);
    } else if (gameSpeedPrompt !== null) {
      alert("Please enter a valid number!");
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "d") {
        var logs = gebid("logs");
        if(logs) {
            if(logs.classList.contains("showLogs")){
                logs.classList.remove("showLogs");
                logs.classList.add("hideLogs");
            } else {
                logs.classList.remove("hideLogs");
                logs.classList.add("showLogs");
            }
        }
    }
});
setTimeout(() => {
    const loadingTracker = setInterval(() => {
        var loadingBar = gebid("loadingBar");
        
        if (loadingMax > 0 && loading === loadingMax) {
            clearInterval(loadingTracker);
            var loadingScreen = gebid("loading");
            if (loadingScreen) {
                loadingScreen.style.display = "none";
            }
            if (!isGameLoopRunning) {
                isGameLoopRunning = true;
                if(gameInterval){clearInterval(gameInterval)}
                gameInterval = setInterval(frame, 1000 / 60);
            }
        }
        else if (loadingMax > 0 && loadingBar) {
            loadingBar.value = (100 * loading / loadingMax);
        }
    }, 1000 / 60);
}, 250);
document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.code === "Space") {
        event.preventDefault(); 
        
        if (!isSpaceHeldDown) {
            isSpaceHeldDown = true;
            preSpaceSpeed = currentSpeed;
            currentSpeed = 2;
            
            console.log("Space held: Speed forced to 2x");
            clearInterval(gameInterval);
            gameInterval = setInterval(frame, 1000 / 60);
        }
    }
    else if(event.key === "ArrowUp"){
        if(placementY>0){placementY--;}
    }
    else if(event.key === "ArrowDown"){
        if(placementY<15){placementY++;}
    }
    else if(event.key === "ArrowLeft"){
        if(placementX>0){placementX--;}
    }
    else if(event.key === "ArrowRight"){
        if(placementX<15){placementX++;}
    }
    else if(event.key === "t"){
        isPlacingTower = true;
    }
    else if(event.key === "T"){
        isPlacingTower = false;
    }
    else if(event.key === "Enter"){
        attemptPlaceTower();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === " " || event.code === "Space") {
        if (isSpaceHeldDown) {
            isSpaceHeldDown = false;
            currentSpeed = preSpaceSpeed;
            
            console.log("Space released: Speed restored to " + currentSpeed + "x");
            clearInterval(gameInterval);
            gameInterval = setInterval(frame, 1000 / 60);
        }
    }
});
if (canvas) {
    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        const rawX = event.clientX - rect.left;
        const rawY = event.clientY - rect.top;
        const scaleFactor = 1000 / rect.height;
        const x = rawX * scaleFactor;
        const y = rawY * scaleFactor;
        placementX = Math.floor(x / 62.5);
        placementY = Math.floor(y / 62.5);
    });
}
if(canvas){canvas.addEventListener("click", function(event){
    if (isPlacingTower) {
        attemptPlaceTower();
        return;
    }
    var foundTower = false;
    for (var i = 0; i < towerArray.length; i++) {
        if (towerArray[i].x === placementX && towerArray[i].y === placementY) {
            selectedTower = towerArray[i];
            towerOpenedID = i;
            updateSidebarUI(selectedTower);
            foundTower = true;
            break;
        }
    }
    if (!foundTower) {
        selectedTower = null;
        hideSidebarUI();
    }
})}
function attemptPlaceTower(){
    if(isPlacingTower){
        var location = trackInfo[placementY][placementX]
        if(location["tower"] == true){
            alert("There is already a tower there! Please pick another location.")
        }
        else if(location["typeTrack"] == grassRock){
            alert("Cannot place on top of rocks!")
        }
        else if(location["typeTrack"] == water || location["typeTrack"] == deepWater){
            alert("Cannot place tower in water (yet)!")
        }
        else if(location["track"] == true){
            alert("This is a road part, you cannot place here!")
        }
        else{
        location["tower"] = true;
        towerArray.push({
            type: towerLists["basic"], 
            x:placementX, 
            y:placementY, 
            direction: Math.PI, 
            reloadTime: towerLists["basic"]["speed"],
            level: [0,0,0, false],
            ID: globalTowerID++})
            isPlacingTower =  false
        }
    }
}
function openStatsMenu(){
    var alertMessage = "Statistics for this tower: \n"
    alertMessage += ("Speed (how long in between firing its attack in seconds): " + (towerArray[towerOpenedID]["type"]["speed"]/60)*0.8**towerArray[towerOpenedID]["level"][0] + "\n")
    alertMessage += ("Range (each square is 1 in this case): " + towerArray[towerOpenedID]["type"]["range"]/62.5* 1.25 ** towerArray[towerOpenedID]["level"][1] + "\n")
    alertMessage += ("Damage (maximum): " + (towerArray[towerOpenedID]["type"]["damage"] + towerArray[towerOpenedID]["level"][2]) + "\n")
    alertMessage += ("Is Merged: No (will add later)")
    alert(alertMessage)
}
function attemptBuySpeedUpgrade(){
    if(towerArray[towerOpenedID]["level"][0] != 3){
    towerArray[towerOpenedID]["level"][0]++;}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function attemptBuyRangeUpgrade(){
    if(towerArray[towerOpenedID]["level"][1] != 3){
    towerArray[towerOpenedID]["level"][1]++;}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function attemptBuyDamageUpgrade(){
    if(towerArray[towerOpenedID]["level"][2] != 3){
    towerArray[towerOpenedID]["level"][2]++;}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function updateSidebarUI(tower) {
    var sidebar = gebid("towerSidebar");
    if (sidebar) sidebar.style.display = "block";
    var speedVal = ((tower.type.speed / 60) * Math.pow(0.8, tower.level[0])).toFixed(2);
    var rangeVal = (tower.type.range / 62.5 * Math.pow(1.25, tower.level[1])).toFixed(1);
    var damageVal = tower.type.damage + tower.level[2];
    gebid("upgradeType").innerHTML = "Tower ID: " + tower.ID
    if (gebid("sidebarTowerName")) gebid("sidebarTowerName").textContent = "Tower Type: " + tower.type.type.toUpperCase();
    if (gebid("sidebarSpeedStat")) gebid("sidebarSpeedStat").textContent = "Attack Delay: " + speedVal + "s (Lv. " + tower.level[0] + ")";
    if (gebid("sidebarRangeStat")) gebid("sidebarRangeStat").textContent = "Tile Range: " + rangeVal + " (Lv. " + tower.level[1] + ")";
    if (gebid("sidebarDamageStat")) gebid("sidebarDamageStat").textContent = "Max Damage: " + damageVal + " (Lv. " + tower.level[2] + ")";
}
function hideSidebarUI() {
    var sidebar = gebid("towerSidebar");
    if (sidebar) sidebar.style.display = "none";
}function resetEnemies(){
    isSpawningFinished = true;
    enemyStats = [];
    currentRound--;
}