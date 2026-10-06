function gebid(input){
    return document.getElementById(input);
}
for(var i=0; i< document.getElementsByClassName("closeMenusX").length; i++){
    document.getElementsByClassName("closeMenusX")[i].addEventListener("click", function(){
       closeAllMenus(); 
    })
}
function log(what){
    if(what == null){
        return null;
    }
    var out = document.createElement("p");
    out.innerHTML = what;
    gebid("logs")?.appendChild(out);
    return out
}
function clearLog(){
    gebid("logs").innerHTML = "Logs: "
}
var gameMusic = false;
var enemiesStillSpawning = true;
var TDHealth = 5;
var doors = ["correct", "false", "random"]
var alreadyChosenRandomDoor = false;
var doorsFloors = 6
var gameVersion = "X.6";
var maxForBar = 0, currentProgress = 0;
var timeLeft = 0;
var activeTree = null;
var currentFolderID = -1;
var tree = [];
var gameId = 0;
var pointsEarned = 0;
var hasOpenedHelp = false;
var globalIdCounter = 0;
const osElement = gebid("inGameVersion");
var currentOS = osElement ? parseInt(osElement.innerHTML) : 1; 
var percentToNewOS, maxPercentToNewOS, levels, specs, OSesUnlocked;
if (localStorage.getItem("version") !== gameVersion || localStorage.getItem("main") === null) {
    localStorage.setItem("version", gameVersion);
    createCookie();
    editCookie();
} else {
    percentToNewOS = getCookieJsonValue("main", "percentToNewOS");
    maxPercentToNewOS = getCookieJsonValue("main", "maxPercentToNewOS");
    levels = getCookieJsonValue("main", "levels");
    specs = getCookieJsonValue("main", "specs");
    OSesUnlocked = getCookieJsonValue("main", "OSesUnlocked");
}
function createCookie() {
    levels =[1,1,1];
    specs = ["4 MB RAM", "66 Mhz CPU", "Integrated GPU, 1MB Vram", '14" CRT Screen, 360p', "512 MB HDD"];
    percentToNewOS = 0;
    maxPercentToNewOS = 100000;
    OSesUnlocked = [true, false, false];
}

function editCookie() {
    const cookieData = {
        levels: levels,
        percentToNewOS: percentToNewOS,
        maxPercentToNewOS: maxPercentToNewOS,
        specs: specs,
        currentOS: currentOS,
        OSesUnlocked: OSesUnlocked
    };
    localStorage.setItem("main", JSON.stringify(cookieData));
}

function getCookieJsonValue(storageKey, jsonKey) {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) return null;

    try {
        const jsonObject = JSON.parse(rawValue);
        return jsonObject[jsonKey] !== undefined ? jsonObject[jsonKey] : null;
    } catch (e) {
        console.error("Malformed JSON in local storage:", e);
        return null;
    }
}
function addStatsToPopup(){
    const parsedLevels = getCookieJsonValue("main", "levels");
    const parsedSpecs = getCookieJsonValue("main", "specs");
    if(gebid("currentLevel")) gebid("currentLevel").innerHTML = "Current Level: " + (parsedLevels ? parsedLevels[0] : 0);
    if(gebid("currentSpecs")) {
        gebid("currentSpecs").innerHTML = "RAM: " + parsedSpecs[0] + "<br/>CPU: " + parsedSpecs[1] + "<br/>GPU: "+ parsedSpecs[2] + "<br/>Screen: " + parsedSpecs[3] + "<br/> Storage: " + parsedSpecs[4];
    }
}

function closeAllMenus(event) {
    if (event && event.target != event.currentTarget) return; 
    const menus = ["helpMenu", "gameMenu", "statsPopup", "powerMenu", "systemMenu", "settingsMenu"];
    menus.forEach(menuId => {
        if(gebid(menuId)) gebid(menuId).className = "closedMenu";
    });
}
function pickGreenDoor(){
    if(doors[0] == "correct"){
        advanceFloorDoors();
    }
    else if(doors[0] == "false"){
        gameOver("wrongDoor");
    }
    else{
        openRandomDoor();
    }
}
function pickBlueDoor(){
    if(doors[1] == "correct"){
        advanceFloorDoors();
    }
    else if(doors[1] == "false"){
        gameOver("wrongDoor");
    }
    else{
        openRandomDoor();
    }
}
function pickRedDoor(){
    if(doors[2] == "correct"){
        advanceFloorDoors();
    }
    else if(doors[2] == "false"){
        gameOver("wrongDoor");
    }
    else{
        openRandomDoor();
    }
}
function advanceFloorDoors(){
    doorsFloors--;
    if(doorsFloors == 1){
        win();
    }
    else{
        shuffleArray(doors);
        alreadyChosenRandomDoor = false;
        gebid("doorsInfoP").innerHTML = "Floor " + doorsFloors + ". " + (doorsFloors-1) + " floors remaining."
        alert("You descend one floor down... and find 3 more doors. Your choice repeats.")
    }
}
function openRandomDoor(){
    if(alreadyChosenRandomDoor){var randomChoice = getRandomNumber(5); if(randomChoice==1){gameOver("wrongDoor")}else if(randomChoice==2){win()}else if(randomChoice==3){advanceFloorDoors();}else if(randomChoice==4){doorsFloors+= 2}else{doorsFloors++;advanceFloorDoors();}return;}
    alert("You found the random door! Click the door you just clicked to choose a random outcome, or click another door to choose it instead. ")
    alreadyChosenRandomDoor = true;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function openHelpMenu(){ closeAllMenus(); if(gebid("helpMenu")) gebid("helpMenu").className = "openHelpMenu"; hasOpenedHelp = true;}
function openSystemMenu(){ closeAllMenus(); if(gebid("systemMenu")) gebid("systemMenu").className = "openSysMenu"; }
function openStats(){ closeAllMenus(); if(gebid("statsPopup")) gebid("statsPopup").className = "openMenu"; addStatsToPopup(); }
function showGameOptions(){ closeAllMenus(); if(gebid("gameMenu")) gebid("gameMenu").className = "openGameMenu"; exitGame();}
function openSettings(){ closeAllMenus(); if(gebid("settingsMenu")) gebid("settingsMenu").className = "openGearMenu"; }
function showPowerOptions(){ closeAllMenus(); if(gebid("powerMenu")) gebid("powerMenu").className = "openPowMenu"; }
function exitGame() {
    if (typeof speedrunInterval !== 'undefined') clearInterval(speedrunInterval);
    if (typeof countdownInterval !== 'undefined') clearInterval(countdownInterval);
    if (typeof updateEnemies !== 'undefined') clearInterval(updateEnemies);
    if (typeof screensaversInterval !== 'undefined') clearInterval(screensaversInterval);
    if (typeof bombPlaceInterval !== 'undefined') clearInterval(bombPlaceInterval);
    if (typeof spawningEnemies !== 'undefined' && Array.isArray(spawningEnemies)) {
        spawningEnemies.forEach(timeoutId => clearTimeout(timeoutId));
        spawningEnemies = [];
    }
    if (gameMusic) {
        if (typeof gameMusic.pause === 'function') {
            gameMusic.pause();
        }
        gameMusic = false;
    }
    const activeEnemies = Array.from(document.getElementsByClassName("towerDefenseEnemy"));
    activeEnemies.forEach(enemy => enemy.remove());
    const activeScreensavers = Array.from(document.getElementsByClassName("screensaverBouncing"));
    activeScreensavers.forEach(saver => saver.remove());
    const activeBombs = Array.from(document.getElementsByClassName("bombScreensaver"));
    activeBombs.forEach(bomb => bomb.remove());
    tree = null;
    currentProgress = 0;
    activeTree = null;
    currentFolderID = -1;
    globalIdCounter = 0;
    alreadyChosenRandomDoor = false;
    doorsFloors = 6;
    TDHealth = 5;
    if(gebid("fileExplorer")) gebid("fileExplorer").classList = "closedMenu";
    if(gebid("doorsPopup")) gebid("doorsPopup").classList = "closedMenu";
    if(gebid("gameModeInTaskbar")) gebid("gameModeInTaskbar").classList = "closedMenu";
    if(gebid("timerForSpeedrun")) gebid("timerForSpeedrun").classList = "closedMenu";
    if(gebid("countdownForSpeedrun")) gebid("countdownForSpeedrun").classList = "closedMenu";
}
function openPopup(popupID){
    if(popupID == "win.exe"){
        gebid("winPopup").classList = "showWinPopup"
        gebid("winPopup").innerHTML = "<p>You Win! Points Earned:<p><p>" + pointsEarned + "</p><br/><button onclick='openPopup(`percentageToNewOS`)'> See Percentage To New OS</button>"
        levels[(currentOS-1)] += 1;
        percentToNewOS += pointsEarned
        editCookie();
    }
    else if(popupID == "percentageToNewOS"){
        var nextButton = (percentToNewOS/maxPercentToNewOS >= 1)? `<button onclick='openPopup("newOS.exe")'>Yay! Time for a new OS!</button>`: `<button onclick='openPopup("closeFile")'>Next</button>`
        gebid("winPopup").innerHTML = "<p>Percentage: </p><p>" + ((percentToNewOS/maxPercentToNewOS)*100).toFixed(1) + "%</p><progress value='" +percentToNewOS + "' max='" + maxPercentToNewOS+ "'></progress>" + nextButton
    }
    else if(popupID == "newOS.exe"){
        gebid("winPopup").innerHTML = "<p>Unlocked New OS: (click the button to be brought to the os select page)</p><button onclick='unlockNextOS()'>Let's Go!</button>";
    }
    else if(popupID == "closeFile"){
        gebid("winPopup").classList = "closedMenu";
        exitGame();
    }
}
function off(){
    alert("Device (fake) will power down. This means the page will automatically redirect to about:blank, a blank page, and all progress will save. Click OK to shut down")
    window.open('about:blank', '_self').close();
}
function restart(){
    alert("Device (fake) will restart. This brings you to the OS select menu (if you have unlocked it). Click OK to restart.")
    window.location = "../"
}
function sleep(){
    alert("Device (fake) will go to sleep. This popup will pause everything, where all background functions will pause other than timers. Do NOT do this in the middle of a level. Click OK to end sleep mode.")
}
function unlockNextOS(){
    if(OSesUnlocked[1] == false){
        OSesUnlocked[1] = true;
        specs = ["8 MB RAM", "132 Mhz CPU", "Integrated GPU, 2MB Vram", '16" CRT Screen, 480p', "768 MB HDD"]
        percentToNewOS = 0;
        maxPercentToNewOS = 150000
    }
    else if(OSesUnlocked[2] == false){
        OSesUnlocked[2] = true;
        specs = ["16 MB Ram", "200 Mhz CPU", "Integrated GPU, 4MV Vram", '20" CRT Screen, 480p', "1 GB HDD"]
        percentToNewOS = 0;
        maxPercentToNewOS = 200000
    }
    editCookie();
    openOSExplorer();
}
function openOSExplorer(){
    document.location = "index.html"
}
function startGame(gameID1){
    exitGame();
    log("Started Game with Game ID " + gameID1)
    gebid("timerForSpeedrun").classList = "closedMenu";
    gebid("gameMenu").classList = "closedMenu";
    gebid("fileExplorer").className = "fileExplorer";
    currentFolderID = -1;
    currentProgress = 0;
    var info;
    switch(gameID1){
        case 1: info = "Game Mode: Normal-Easy";break;
        case 2: info = "Game Mode: Speedrun-Easy";break;
        case 3: info = "Game Mode: Screensaver";break;
        case 4: info = "Game Mode: Normal-Med";break;
        case 5: info = "Game Mode: Speedrun-Med";break;
        case 6: info = "Game Mode: Tower Defense";break;
        case 7: info = "Game Mode: Normal-Hard";break;
        case 8: info = "Game Mode: Speedrun-Hard";break;
        case 9: info = "Game Mode: Doors";break;
        default: info = "Error: Game ID is corrupted";break;}
    gebid("gameModeInTaskbar").innerHTML = "<p>" + info + "</p>";
    gebid("gameModeInTaskbar").classList = "showGameModeTaskbar"
    if(gameID1 == 7 || gameID1 == 8 || gameID1 == 9) { maxForBar = 4; tree = createTree(8); }
    else if(gameID1 == 4 || gameID1 == 5 || gameID1 == 6) { maxForBar = 3; tree = createTree(7); }
    else { maxForBar = 2; tree = createTree(6); }

    if(gameID1 == 2) {startSpeedrun(121); gameMusic = false;}
    else if(gameID1 == 5){startSpeedrun(61); gameMusic = false;}
    else if(gameID1 == 8){startSpeedrun(31); gameMusic = false;}
    else if(gameID1 == 6){startTowerDefense();}
    else if(gameID1 == 3){startScreensaver();}
    else if(gameID1 == 9){startDoors(); doorsFloors = 6; shuffleArray(doors);}
    else{gameMusic = new Audio("images/sounds/BGM's/NormalMusic.wav");gameMusic.play();}
    gameId = gameID1;
    activeTree = tree;
    for(var i = 0; i < maxForBar; i++){
        let folderNode = null;
        let attempts = 0;
        while(!folderNode) {
            let testNode = findNodeById(tree, getRandomNumber(globalIdCounter));
            if(testNode && testNode.inside && Array.isArray(testNode.inside)) {
                folderNode = testNode;
            }
            attempts++;
        }
        
        if(folderNode) {
            folderNode.inside.push({
                Name: "correct.exe",
                inside: null,
                depth: folderNode.depth + 1,
                id: globalIdCounter++,
                fileSize: getRandomNumber(100) + 1,
                parentID: folderNode.id
            });
            if(gameVersion.includes("dev")){
                log(folderNode.id)
            }
        }
    }
    updateFileExplorer(activeTree, currentFolderID);
    if(gameID1 % 3 == 0){
        gebid("fileExplorer").classList="closedMenu"
    }
}
var mouseX, mouseY
function startScreensaver(){
    for(var i=0;i<10;i++){
        createScreensaverEnemy();
    }
    screensaversInterval = setInterval(() => {updateScreensavers()}, 1000/60)
    bombPlaceInterval = setInterval(() => {placeBomb()},2000)
}
var screensavesInterval, bombPlaceInterval;
function updateScreensavers() {
    var screensavers = Array.from(document.getElementsByClassName("screensaverBouncing"));
    var bombs = Array.from(document.getElementsByClassName("bombScreensaver"));
    for (var i = screensavers.length - 1; i >= 0; i--) {
        var screensaver = screensavers[i];
        if (!screensaver.parentNode) continue; 
        var screensaverBox = screensaver.getBoundingClientRect();

        for (var j = bombs.length - 1; j >= 0; j--) {
            var bomb = bombs[j];
            if (!bomb.parentNode) continue; 
            var bombBox = bomb.getBoundingClientRect();
            var isColliding = !(
                screensaverBox.top > bombBox.bottom ||
                screensaverBox.right < bombBox.left ||
                screensaverBox.bottom < bombBox.top ||
                screensaverBox.left > bombBox.right
            );

            if (isColliding) {
                screensaver.remove();
                bomb.remove();
                if(document.getElementsByClassName("screensaverBouncing").length == 0){
                    for(var i=0; i< bombs.length; i++){bombs[i].remove();}
                    clearInterval(bombPlaceInterval)
                    clearInterval(screensaversInterval)
                    win(3, 0);
                }
                break;
            }
        }
    }
}
function placeBomb(){
    var bomb = document.createElement("img");
    bomb.classList = "bombScreensaver"
    bomb.style.left = String((mouseX - parseInt(window.innerWidth)*0.025)) + "px"
    bomb.style.top = String((mouseY - parseInt(window.innerWidth)*0.025)) + "px"
    bomb.src="images/random/bomb.png"
    document.body.appendChild(bomb)
}
function createScreensaverEnemy(){
    var screensaver = document.createElement("img");
    screensaver.classList = "screensaverBouncing";
    var durationX = (getRandomNumber(30) + 40) / 10; 
    var durationY = (getRandomNumber(30) + 25) / 10;
    var randomDelay = -(getRandomNumber(70) / 10);
    screensaver.style.setProperty("--durX", durationX + "s");
    screensaver.style.setProperty("--durY", durationY + "s");
    screensaver.style.setProperty("--randomDelay", randomDelay + "s");
    
    screensaver.src = "images/gameModes/screensaver.png";
    document.body.appendChild(screensaver);
}
window.addEventListener("mousemove", function(event){mouseX = event.clientX; mouseY = event.clientY;})
function startTowerDefense(){
    if (enemyMovementInterval) clearInterval(enemyMovementInterval);
    if (enemySpawnCapTimeout) clearTimeout(enemySpawnCapTimeout);
    spawningEnemies.forEach(timeoutId => clearTimeout(timeoutId));
    spawningEnemies = [];

    var amount = getRandomNumber(30) + 20;
    if(gameVersion.includes("dev")){ amount = 10; }
    log("Spawning " + amount + " TD enemies.");
    
    enemiesStillSpawning = true;
    TDHealth = 5;
    for (var i = 0; i < amount; i++){
        spawningEnemies.push(setTimeout((currentId) => createEnemy(currentId), (1000 * i), i));
    }
    enemySpawnCapTimeout = setTimeout(() => {
        enemiesStillSpawning = false;
    }, 1000 * amount);
    enemyMovementInterval = setInterval(updateEnemiesEngine, 1000 / 60);
}
var updateEnemies1 = false;
var enemyMovementInterval = null;
var spawningEnemies = [];
var enemySpawnCapTimeout = null;
function updateEnemiesEngine(){
    var enemies = document.getElementsByClassName("towerDefenseEnemy");
    if(enemies.length == 0 && !enemiesStillSpawning){
        clearInterval(enemyMovementInterval);
        win(6, 0); 
        return;
    }
    
    for (var i = enemies.length - 1; i >= 0; i--){
        var enemy = enemies[i];
        var currentLeft = parseInt(enemy.style.left) || 0;
        var newLeft = currentLeft + (window.innerHeight / 600);
        enemy.style.left = newLeft + "px";
        
        if (newLeft >= window.innerWidth) {
            TDHealth--;
            enemy.remove();
            
            if (TDHealth < 1) {
                gameOver("noHPLeft");
                break;
            }
        }
    }
}

function createEnemy(enemyId){
    var enemy = document.createElement("img");
    enemy.src = "images/random/TDEnemy.png";
    enemy.id = enemyId;
    enemy.addEventListener("click", () => {log("test");enemy.remove()})
    enemy.classList.add("towerDefenseEnemy");
    enemy.style.top = getRandomNumber(window.innerHeight*0.88)+(window.innerHeight*0.12) + "px";
    enemy.style.left = "0px"; 
    
    document.body.appendChild(enemy);
}
function startDoors(){
    gebid("doorsPopup").classList = "showDoorsPopup"
}
function openFile(id){
    if(!activeTree) return;
    var node = findNodeById(activeTree, id);
    if(!node) return;

    if(node.Name === "correct.exe"){
        currentProgress++;
        if(gebid("progressToWin")) {
            gebid("progressToWin").value = 100 * (1 / maxForBar) * currentProgress;
        }
        if(currentProgress === maxForBar){
            win(gameId, timeLeft);
        }
        deleteFile(node.id)
    } else {
        log("Opened file: " + node.Name);
    }
}
function win(gameID, timeLeft = 0){
    var difficulty;
    alert('You won! Click "OK" to go and claim your prizes!')
    var bonusPoints = (hasOpenedHelp*100)
    hasOpenedHelp = false;
    gebid("timerForSpeedrun").classList = "closedMenu"
    if(gameID == 1 || gameID == 2 || gameID == 3){
        difficulty = 0.8;
    }
    else if(gameID == 4 || gameID == 5 || gameID == 6){
        difficulty = 1;
    }
    else{
        difficulty = 1.5;
    }
    pointsEarned = (levels[0]*difficulty*1000)+(100*timeLeft)+bonusPoints;
    openPopup("win.exe")
    exitGame();
}
function deleteFile(id) {
    var whatToDel = findNodeById(tree, id);
    if (!whatToDel) return;
    var parentIdForLater = whatToDel.parentID;
    var parentNode = findNodeById(tree, parentIdForLater);
    if (parentNode && parentNode.inside) {
        var index = parentNode.inside.findIndex(item => item.id === id);
        if (index !== -1) {
            parentNode.inside.splice(index, 1);
        }
    }
    updateFileExplorer(activeTree, parentIdForLater);
}
function openFolder(id){
    currentFolderID = id
    updateFileExplorer(activeTree, id);
}

let lastInside = null;
function updateFileExplorer(tree, currentID){
    var targetNode = findNodeById(tree, currentID);
    if (!targetNode || !targetNode.inside) return;
    
    var insert = "";
    var newtBody = document.createElement("tbody");
    if(targetNode.inside.length == 0){
        insert += "<tr><td>(the</td><td>folder</td><td>is</td><td>empty...?</td><td>)</td></tr>"
    }
    for(var i = 0; i < targetNode.inside.length; i++){
        var item = targetNode.inside[i];
        var isFolder = item.inside !== null;
        
        var actionButton = isFolder ? 
            `<button class='clickButton' onclick='openFolder(${item.id})'>Go Inside Folder</button>` : 
            `<button class='clickButton' onclick='openFile(${item.id})'>Open</button>`;
        var isExecutable = (isFolder || item.Name.includes(".mp3") || item.Name.includes(".exe")) ? "Yes" : "No";
        var isCorrectSystemFile = (item.Name.toLowerCase() === "correct.exe" || item.Name === "Bonus.exe") ? "Yes" : "IDK, you choose";
        
        insert += `<tr><td>` + actionButton + `</td><td>` + item.Name + `</td><td>` + item.fileSize + `MB</td><td>${isExecutable}</td><td>${isCorrectSystemFile}</td><td>${item.id}</td></tr>`;
    }
    if(currentFolderID == -1){
        var test = null;
    }
    else if(findNodeById(tree,currentFolderID).parentID == -1){
        insert += "<tr><td><button onclick='openFolder(-1)'>Return To Top</button></td><td></td><td></td><td></td><td></td></tr>";
    }
    else{
        insert += "<tr><td><button onclick='openFolder(" + findNodeById(tree, currentFolderID).parentID + ")'>Return Up 1 Folder</button></td><td></td><td></td><td></td><td></td><td></td></tr>";
    }
    newtBody.id = "tBodyMainExplorer";
    newtBody.innerHTML = insert;
    if(lastInside !== newtBody.innerHTML){
        gebid("tBodyMainExplorer")?.remove();
        gebid("fileShower")?.appendChild(newtBody);
    }
    lastInside = newtBody.innerHTML;
}

function updateTime() {
  if(gebid("clock")) gebid("clock").innerText = new Date().toLocaleTimeString();
}
function getRandomNumber(mult){ return Math.floor(Math.random() * mult); }

function findNodeById(tree, targetId){
    for (let node of tree) {
        if (node.id === targetId) return node;
        if (node.inside && node.inside.length > 0) {
            const foundInDeepResult = findNodeById(node.inside, targetId);
            if (foundInDeepResult) return foundInDeepResult;
        }
    }
    return null; 
}

function createFolderNesting(depth, max, parentID){
    globalIdCounter++;
    if (max <= 0 || depth > 4) return null;
    var currentThisFolderID = globalIdCounter; 
    var inside = []; 
    
    let randomForFor = (getRandomNumber(max/2) + 0.5 * max);
    for(let i = 0; i < randomForFor; i++){ 
        const childFolder = createFolderNesting(depth + 1, max - 1, currentThisFolderID);
        if (childFolder) inside.push(childFolder);
    }
    
    var addedFileSize = 1;
    for(var i=0; i< inside.length; i++){
        addedFileSize += (inside[i]["fileSize"] || 1);
    }
    
    return {
        Name: randomFolderList[getRandomNumber(randomFolderList.length)], 
        inside: inside, 
        depth: depth,
        id: currentThisFolderID,
        fileSize: addedFileSize,
        parentID: parentID
    };
}

function createTree(maxDepth){
    globalIdCounter = 0;
    var out = [{Name: "User", inside: [], depth:0, id: -1}];
    for(let i = 0; i < maxDepth; i++){ 
        var out2 = createFolderNesting(1, 3, -1);
        if(out2) out[0]["inside"].push(out2);
    }
    return out;
}
var speedrunInterval = null; 
var countdownInterval = null;

function gameOver(typeDeath) {
    if(typeDeath == "noHPLeft"){
        alert("No heath left...")
        gebid("BSODImg").src = "images/BSODs/95-user.svg"
    }
    if(typeDeath == "speedrunTime"){
    clearInterval(speedrunInterval);
    alert("Time's up! Game Over.");
    gebid("BSODImg").src="images/BSODs/95-time.svg"}
    else if(typeDeath == "wrongDoor"){alert("Oh no! You chose the wrong door. Game Over.");gebid("BSODImg").src="images/BSODs/95-user.svg"}
    gebid("BSODImg").classList = "BSODShow"
    gebid("BSOD").classList = "ShowBSOD"
}

function startSpeedrun(time){
    timeLeft = time; 
    gebid("countdownForSpeedrun").classList = "countdownShow";
    if(time == 121){gameMusic = new Audio("images/sounds/BGM's/SpeedrunSlow.wav");}
    else if(time == 31){gameMusic = new Audio("images/sounds/BGM's/SpeedrunFast.wav");}
    else{gameMusic = new Audio("images/sounds/BGM's/Speedrun.wav");}
    let progressVal = 2000;
    countdownInterval = setInterval(() => {
        progressVal -= 20;
        if(gebid("countdownForSpeedrunProgress")) gebid("countdownForSpeedrunProgress").value = progressVal;
    }, 20);
    gameMusic.play();

    setTimeout(() => {
        clearInterval(countdownInterval);
        alert("Go!");
        gebid("timerForSpeedrun").classList = "showTimer";
        gebid("countdownForSpeedrun").classList = "closedMenu";
        
        tickDownTimer();
        speedrunInterval = setInterval(tickDownTimer, 1000);
    }, 2000);
}

function tickDownTimer(){
    timeLeft--;
    if(gebid("timerForSpeedrun")) gebid("timerForSpeedrun").innerHTML = "Time Left: " + timeLeft;
    if(timeLeft <= 0){
        gameOver("speedrunTime");
    }
}    
gebid("statsMenu")?.addEventListener("click", function(){ openStats(); });
gebid("startMenu")?.addEventListener("click", function(){ openSystemMenu(); });
    
document.body.addEventListener("keydown", function(event){
    if(event.key.toLowerCase() === "d" && gebid("logs")){
        gebid("logs").classList.toggle("logsOpen");
        gebid("logs").classList.toggle("closedMenu");
    } else if(event.key.toLowerCase() === "s"){
        openSystemMenu();
    }
});
beginCode();

const fileNames = ["Random.exe", "Log.txt", "Error.exe", "Game.exe", "Bonus.exe", "CheeseNoise.mp3", "RUSHE.mp3", "Music-Player.exe", "Broken.???", "Nothing.non", "recursion.exe"];
const randomFolderList = ["Main", "Main2", "Gameyz", "MT", "ActuallyImportantFiles", "PrivateStuff", "Secret", "InHere", "IDKWhatToPutHere", "DevSaysHi", "Thingies"];

function beginCode(){
    updateTime();
    setInterval(updateTime, 1000);
    console.log("You should not be here...");
}