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
        logsDiv.appendChild(logEntry);
    }
}

function error(message){
    var logsDiv = gebid("logs");
    if(logsDiv) {
        var logEntry = document.createElement("p");
        logEntry.textContent = message;
        logEntry.style.color = "red";
        logsDiv.appendChild(logEntry);
    }
}
function clearLogs(){
    gebid("logs").innerHTML = "<p class='top'></p><p id='fpsCounter'>FPS: 0."
}
var loading = 0;
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
            if ((Math.abs(enemy["x"] - nextWaypoint["x"])) <= enemy["type"]["speed"] && 
                (Math.abs(enemy["y"] - nextWaypoint["y"])) <= enemy["type"]["speed"]) {
                enemy["direction"] = nextWaypoint["direction"];
                enemy["pathAmount"]++;
            }
            if(enemy["direction"] == Math.PI){ enemy["x"] += enemy["type"]["speed"]; }
            else if(enemy["direction"] == Math.PI*0.5){ enemy["y"] -= enemy["type"]["speed"]; }
            else if(enemy["direction"] == Math.PI*1.5){ enemy["y"] += enemy["type"]["speed"]; }
            else if(enemy["direction"] == 0 || enemy["direction"] == Math.PI*2){ enemy["x"] -= enemy["type"]["speed"]; }
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

            log("Successfully loaded index criteria parameters. Round " + (currentRound + 1) + " started!");
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
        enemyStats.push({
            type: activeWaves[0]["type"],
            x: entrance["x"],
            y: entrance["y"],
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
    if(typeof projectileList !== 'undefined' && projectileList){
        for (var i = projectileList.length - 1; i >= 0; i--) {
            var proj = projectileList[i];
            var speed = (proj["Type"] && proj["Type"]["projSpeed"]) ? proj["Type"]["projSpeed"] : 10;
            proj["x"] += Math.cos(proj["direction"]) * speed;
            proj["y"] += Math.sin(proj["direction"]) * speed;
            if (proj["x"] < -100 || proj["x"] > 1100 || proj["y"] < -100 || proj["y"] > 1100) {
                projectileList.splice(i, 1);
            }
        }
        for(var i=0;i<projectileList.length;i++){
            drawImg(projectileList[i]["Type"]["image"], projectileList[i]["x"], projectileList[i]["y"], 62.5,62.5, projectileList[i]["direction"])
        }
    }
}
function createProjectile(x,y,direction,towType, level){
projectileList.push({
    Type: projectileData[towType][level],
    x: x*62.5,
    y: y*62.5,
    direction: direction
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
        drawImg(tower["type"]["image"], tower["x"] * 62.5-31.25, tower["y"] * 62.5-31.25, 62.5, 62.5, tower["direction"]);
        if (tower["reloadTime"] > 0) {
            tower["reloadTime"]--;
        }
        
        var targetedEnemy = null;
        if(enemyStats && enemyStats.length > 0){
            targetedEnemy = checkForTargetedEnemy(tower["x"], tower["y"], "first", 300);
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
                tower["reloadTime"] = tower["type"]["speed"];
                createProjectile(tower["x"]-0.5, tower["y"]-0.5, tower["direction"], "Normal", "t00");
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
                log("All components loaded successfully. Starting core engine loop...");
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