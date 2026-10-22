//NOTES:
//62.5 is one unit
//31.25 is half a unit
//1000*1000 is main canvas size
//Split into 5 parts: This, projectiles.js, towerCode.js, enemyCode.js, and track#.js (currently just track1.js).
//when using initImage, /images/ is auto applied
//WHEN RELEASING, remove "dev" from start to help


var mapChoicePrompt = prompt("Please choose a map number (max 2):")
if (mapChoicePrompt == null || mapChoicePrompt.trim() === "" || Number.isFinite(Number(mapChoicePrompt)) != true) {
    alert("Not an applicable map choice! Will be set to map one instead! Please reload to pick a diffrent map if you want.")
    mapChoicePrompt = 2;
}
mapChoicePrompt = Math.max(mapChoicePrompt,1)


//Setup variables
//qwertyuiopasdfghjklzxcvbnm
var version = "X.4.1"
var loading = 0;
var loadingMax = 0;
function gebid(id) {
    return document.getElementById(id);
}
//Setup image function
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

//Set logs info
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
})

//Logs messages (log, warn and error) and clearLogs() to flush info
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
    gebid("logs").innerHTML = "<p class='top'></p><p id='fpsCounter'>FPS: waiting..."
}


//Update loading bar for loading popup
function updateProgressBar(value) {
    try{
    const v = Math.max(0, Math.min(100, value));
    let red, green;

    if (v < 50) {
        red = 255;
        green = Math.round(255 * (v / 50));
    } 
    else {
        red = Math.round(255 * (1 - (v - 50) / 50));
        green = 255;
    }
    const progressBar = document.getElementById('my-progress-bar');
    progressBar.style.width = `${v}%`;
    progressBar.style.backgroundColor = `rgb(${red}, ${green}, 0)`;}
    catch(error){
        log("Error updating progress bar: " + error)
    }
}
updateProgressBar(100)




//Main define variables (basically the longest line in this whole thing)
//effects require an initImage broken into frames (starts at 0), x pos, y pos, width, height, rotation, opacity, frame (current), and a max frame 
var towerBeingPlacedType = 0, hasSeenEndlessModeAlert = false, effects = [], money = 500, farmsBuffExtraMoney = 0, hp = 100, selectedTower = null, towerOpenedID = 0, globalTowerID = 0, isPlacingTower = false, placementX = 0, mouseX = 0, mouseY = 0, placementY = 0, isSpawningFinished = false, preSpaceSpeed = 1, isSpaceHeldDown = false, enemySpawnedIDs = 0, currentWave = 0, gameInterval = null, framesToSpawn = 0, currentSpeed = 1, frameCount = 0, totalFramesRendered = 0, lastTime = performance.now(), currentRound = 0, fps = 60, isGameLoopRunning = false, eorMoney = 0; 



//For me only: If I am editing, give me infinite money and hp for testing

if(version.includes("dev")){money = 10000000000000000000; hp = 10000000000000000000}

//Fuunction to get a random number
function getRandomNumber(max){
    return Math.round(Math.random()*max)
}

//Setup canvas for drawing information
var canvas = gebid("mainGameCanvas");
var ctx = canvas ? canvas.getContext("2d") : null;
function scaleImage(wantedWidth, wantedHeight){
    if (!canvas) return [wantedWidth, wantedHeight];
    var width = wantedWidth * canvas.width / 1000;
    var height = wantedHeight * canvas.height / 1000;
    return [width, height];
}


//Function to draw important images in canvas made above
function drawImg(image, x, y, width, height, rotation = 0, opacity = 1) {
    if (!image || !ctx) return; 
    ctx.imageSmoothingEnabled = false;
    const [scaledW, scaledH] = scaleImage(width, height);
    const [scaledX, scaledY] = scaleImage(x, y);
    if(opacity != 1){ctx.globalAlpha = opacity}
    if (rotation === 0) {
        ctx.setTransform(1, 0, 0, 1, scaledX, scaledY);
        ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH); 
    } else {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        ctx.setTransform(cos, sin, -sin, cos, scaledX, scaledY);
        ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    }
    ctx.globalAlpha = 1.0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

//Almost useless, but still necessary
function createArrayForGrid(rows, cols, what){
    return Array.from({ length: rows }, () => Array(cols).fill(what));
}

//Draw each piece of the track from top left to bottom right
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

//Function to change speed using [space] key
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

//Draw the enemies
function drawEnemies(){
    if(enemyStats){
        for(var i=0; i<enemyStats.length; i++){
            if(enemyStats[i]["type"] == "boss1"){
                drawImg(enemyStats[i]["type"]["src"], enemyStats[i]["x"], enemyStats[i]["y"], 125, 125, 0)
            }
            else{
                drawImg(enemyStats[i]["type"]["src"], enemyStats[i]["x"], enemyStats[i]["y"], 62.5, 62.5, enemyStats[i]["direction"])
            }
            }
    }
}

//Maths stuff
function findDist(x1, y1, x2, y2){return Math.hypot(x2 - x1, y2 - y1);}
function getAngleToTarget(imgX, imgY, targetX, targetY) {
    const dx = targetX - imgX;
    const dy = targetY - imgY;
    return Math.atan2(dy, dx);
}

//Nuke ability
function activateNuke(){
    if(money >= 1000){
    var nukeEffect = initImage("effects/nukeImages/nukeEffect.png");
    var nukeEffect2 = initImage("effects/nukeImages/nukeEffect2.png");
    var nukeEffect3 = initImage("effects/nukeImages/nukeEffect3.png");
    effects.push({
        image: [nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect3, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect2, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect, nukeEffect],
        x: 500, y: 500, width:1000, height:1000, direction: 0, frame: 0, opacity: 0.75
    })
    for(var j=0; j<50; j++){
    setTimeout(() => {for(var i=0; i< enemyStats.length; i++){enemyStats[i]["damageTaken"]++}}, (1000/60)*j)}}
    else{alert("Not enough money to activate nuke!")}
}


//Draw effects to screen, with rotation, opacity and other info
function drawEffects(){
    for(var i=0; i < effects.length; i++){
        var frame = effects[i]["frame"]
        drawImg(effects[i]["image"][frame], effects[i]["x"], effects[i]["y"], effects[i]["width"], effects[i]["height"], effects[i]["rotation"], effects[i]["opacity"]);
        effects[i]["frame"]++;
        if(frame + 1 == effects[i]["image"].length){
            effects.splice(i,1)
        }
    }
}

//Main game loop
function frame(){
    for(var l=0; l<currentSpeed; l++){
    var framePart = 0;
    frameCount++;
    totalFramesRendered++; 
    if (!ctx) return;
    
    try {
        framePart++;
        gebid("moneyCounter").innerHTML = "Money: " + money;
        framePart++
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        framePart++
        updateEnemySpawning();
        framePart++
        drawTrack();
        framePart++
        updateEnemyStats();
        framePart++
        drawEffects();
        framePart++
        drawEnemies();
        framePart++
        drawProjectiles();
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
            var type = null;
            if(towerBeingPlacedType == 0){type = towerLists["basic"]["image"]} else if(towerBeingPlacedType == 1){type = towerLists["music"]["image"]} else if(towerBeingPlacedType == 2){type = towerLists["boat"]["image"]} else if(towerBeingPlacedType == 3){type = towerLists["super"]["image"]} else if(towerBeingPlacedType == 4){type = towerLists["farm"]["image"]}
            drawImg(type, placementX * 62.5+31.25, placementY * 62.5+31.25, 62.5, 62.5, 0);
            ctx.globalAlpha = 1.0;
        }
        framePart++
    } catch (err) {
        log("Loop crashed on frame component execution: " + err.message + " at frame part " + framePart);
    }
    }
}

//Report the FPS (frames per second) to the log to help
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


//Adds a new script to the main page
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
if(canvas && ctx) {
    reportFPS();
}


//Adds new scripts
addNewScript("track" + mapChoicePrompt + ".js");
addNewScript("enemyCode.js");
addNewScript("towerCode.js");
addNewScript("projectiles.js");


//Gets next round button to add a function to it.
gebid("nextRoundButton").addEventListener("contextmenu", function(event){
    event.preventDefault();
    var skipAmount = prompt("How many rounds to skip? (Will be removed in prebeta 0.1)");
    if (skipAmount !== null && skipAmount.trim() !== "" && Number.isFinite(Number(skipAmount))) {
        for(var i=0; i < skipAmount; i++){
            currentRound++;
            isSpawningFinished = true;
            enemyStats = [];
        }
    }
})

//Gets speed button right click to set up to 20x speed.
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

//sets timeout to wait 250 seconds and then 60 times a second check loading to check if should open the game for playing
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

//Keyboard uses
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
        towerBeingPlacedType = 0;
    }
    else if(event.key === "s"){
        isPlacingTower = true;
        towerBeingPlacedType = 1;
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


//Uses canvas mouse location for info and click info for placing/upgrading towers
if (canvas) {
    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        const rawX = event.clientX - rect.left;
        const rawY = event.clientY - rect.top;
        mouseX = rawX*1000/window.innerHeight, mouseY = rawY*1000/window.innerHeight;
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