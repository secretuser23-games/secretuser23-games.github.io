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
function gebid(id) {
    return document.getElementById(id);
}
function scaleImage(wantedWidth, wantedHeight){
    var width = wantedWidth * canvas.width / 1000;
    var height = wantedHeight * canvas.height / 1000;
    return [width, height];
}
function drawImg(image, x, y, width, height, rotation = 0) {
    if (!image) return; 
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
    for(var i=0; i<size;i++){
        for(var j=0; j<size;j++){
            drawImg(gridImg, i * 1000 / size, j * 1000 / size, 1000 / size, 1000 / size);
        }
    }
}
function createArrayForGrid(rows, cols, what){
    return Array.from({ length: rows }, () => Array(cols).fill(what));
}

function addNewScript(src){
    loadingMax++;
    var newScript = document.createElement("script");
    newScript.onload = function(){
        loading++;
        log(src + " loaded successfully.");
    };
    newScript.onerror = function() {
        error("Failed to load script: " + src);
    };
    newScript.src = src;
    document.body.appendChild(newScript);
    frameCount++;
}

function frame(){
    frameCount++; 
    
    try {
        ctx.clearRect(0, 0, 1000, 1000);
        
        drawGrid(16);
        drawTrack();
        
        if (typeof entranceIndicator !== 'undefined' && entranceIndicator) {
            drawImg(entranceIndicator, 0, 0, 62.5, 62.5);
        }
    } catch (err) {
        log("Loop crashed on frame component execution: " + err.message);
    }
}
function drawTrack(){
    if (typeof trackInfo === 'undefined') return; 
    for(var i=0; i<trackInfo.length; i++){
        for(var j=0; j<trackInfo[i].length; j++){
            if(trackInfo[i][j] && trackInfo[i][j]["typeTrack"] != null){
                drawImg(trackInfo[i][j]["typeTrack"], j * 62500 / canvas.height, i * 62500 / canvas.width, 62.5, 62.5);
            }
        }
    }
}
function reportFPS() {
    const now = performance.now();
    const duration = now - lastTime;
    const fps = Math.round((frameCount * 1000) / duration);
    var counter = gebid("fpsCounter");
    if(counter) counter.innerHTML = "FPS: " + fps + ".";
    frameCount = 0;
    lastTime = now;
    setTimeout(reportFPS, 1000);
}

var loading = 0;
var loadingMax = 0;
var frameCount = 0;
var lastTime = performance.now();
var currentRound = 0;
var fps = 60;
var canvas = gebid("mainGameCanvas");
var ctx = canvas.getContext("2d");
var isGameLoopRunning = false; 
reportFPS();

window.initImage = function(src){
    loadingMax++;
    var out = new Image();
    
    out.onload = function(){
        loading++;
    };
    
    out.onerror = function() {
        error("Failed to load image at destination path: " + out.src);
    };
    out.src = "images/" + src; 
    return out;
};

addNewScript("track1.js");

var gridImg = window.initImage("gridSystemImage.png");
var testImage = window.initImage("water/deepWater.png");

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
            setInterval(frame, 1000 / 60);
        }
    }
    else if (loadingMax > 0 && loadingBar) {
        loadingBar.value = (100 * loading / loadingMax);
    }
}, 1);