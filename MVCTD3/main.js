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
var loading = 0;
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
        ctx.drawImage(image, 0, 0, scaledW, scaledH);
    } else {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        ctx.setTransform(cos, sin, -sin, cos, scaledX, scaledY);
        ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGrid(size){
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            drawImg(gridImg, i * 1000 / size, j * 1000 / size, 1000 / size, 1000 / size);
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

    for(var i=0; i<trackInfo.length; i++){
        if (!trackInfo[i]) continue; 

        for(var j=0; j<trackInfo[i].length; j++){
            var tile = trackInfo[i][j];
            if(tile && tile["typeTrack"] != null){
                drawImg(tile["typeTrack"], j * tileWidth, i * tileHeight, tileWidth, tileHeight);
                if(tile["trackDetails"]){
                    drawImg(tile["trackDetails"], j*tileWidth, i*tileHeight, tileWidth, tileHeight)
                }
            }
        }
    }
}
function updateEnemyStats(){
    if(enemyStats){
        // Loop backwards to safely delete items while iterating
        for(var i = enemyStats.length - 1; i >= 0; i--){
            
            // Movement logic
            if(enemyStats[i]["direction"] == Math.PI){ enemyStats[i]["x"] += enemyStats[i]["type"]["speed"]; }
            else if(enemyStats[i]["direction"] == Math.PI*0.5){ enemyStats[i]["y"] -= enemyStats[i]["type"]["speed"]; }
            else if(enemyStats[i]["direction"] == Math.PI*1.5){ enemyStats[i]["y"] += enemyStats[i]["type"]["speed"]; }
            else if(enemyStats[i]["direction"] == 0 || enemyStats[i]["direction"] == Math.PI*2){ enemyStats[i]["x"] -= enemyStats[i]["type"]["speed"]; }
            
            // Checkpoint collision logic
            if((Math.abs(enemyStats[i]["x"]-path[enemyStats[i]["pathAmount"]+1]["x"]))<=enemyStats[i]["type"]["speed"] && (Math.abs(enemyStats[i]["y"]-path[enemyStats[i]["pathAmount"]+1]["y"]))<=enemyStats[i]["type"]["speed"]){
                enemyStats[i]["direction"] = path[enemyStats[i]["pathAmount"]+1]["direction"];
                enemyStats[i]["pathAmount"]++;
                
                // If there are no more path steps left, safely remove THIS enemy using index i
                if(!path[enemyStats[i]["pathAmount"]+1]){
                    enemyStats.splice(i, 1); 
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
function updateEnemySpawning() {
    if(framesToSpawn >= enemySpawnArray[0][0]["inBetweenTime"] && enemySpawnArray[0][0]["amount"] != 0){
        enemyStats.push({
            type:enemySpawnArray[0][0]["type"],
            x: entrance["x"],
            y: entrance["y"],
            pathAmount:0,
            distanceTraveled:0,
            id:3,
            direction:Math.PI
        })
        framesToSpawn = 0;
        enemySpawnArray[0][0]["amount"] -= 1;
    }
    framesToSpawn++;
}
function frame(){
    frameCount++;
    totalFramesRendered++; 
    if (!ctx) return;
    
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateEnemySpawning();
        drawGrid(16);
        drawTrack();
        updateEnemyStats();
        drawEnemies();
    } catch (err) {
        log("Loop crashed on frame component execution: " + err.message);
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
var gridImg = window.initImage("gridSystemImage.png");
var testImage = window.initImage("ExitIndicator.png");
gebid("speedButton").addEventListener("contextmenu", function(event) {
    // Prevent the default browser right-click menu from popping up
    event.preventDefault(); 
    
    var gameSpeedPrompt = prompt("How fast (1 is normal speed) do you want the game to be? Note, going above 10x may lag the computer or the game.");
    
    // Removed quotes so it checks the actual variable value
    if (gameSpeedPrompt !== null && gameSpeedPrompt.trim() !== "" && Number.isFinite(Number(gameSpeedPrompt))) {
      // Use parseFloat so players can do 1.5x or 0.5x speed
      currentSpeed = parseFloat(gameSpeedPrompt); 
      console.log("Game speed changed to: " + currentSpeed);
      clearInterval(gameInterval)
      gameInterval = setInterval(frame, 1000/(60*currentSpeed))
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