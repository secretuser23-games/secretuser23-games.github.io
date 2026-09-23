function gebid(input){
    return document.getElementById(input);
}

function log(what){
    var out = document.createElement("p");
    out.innerHTML = what;
    gebid("logs")?.appendChild(out);
}

var globalIdCounter = 0; 
var levels =[0], specs = [`4 MB RAM`, `33 Mhz CPU`, `Integrated GPU`, `9" CRT Screen` ];
document.cookie = "levels=" + JSON.stringify(levels) + "; path=/;";
document.cookie = "percentToNewOS=0; path=/;";
document.cookie = "specs=" + JSON.stringify(specs) + "; path=/;";
document.cookie = "currentOS=1; path=/;";

function getCookieValue(cookieName) {
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return cookie.substring(cookieName.length + 1, cookie.length);
        }
    }
    return null;
}

function addStatsToPopup(){
    const parsedLevels = JSON.parse(getCookieValue("levels"));
    const parsedSpecs = JSON.parse(getCookieValue("specs"));
    if(gebid("currentLevel")) gebid("currentLevel").innerHTML = "Current Level: " + (parsedLevels ? parsedLevels[0] : 0);
    if(gebid("currentSpecs")) {
        gebid("currentSpecs").innerHTML = "RAM: " + parsedSpecs[0] + "<br/>CPU: " + parsedSpecs[1] + "<br/>GPU: "+ parsedSpecs[2] + "<br/>Screen: " + parsedSpecs[3];
    }
}

function closeAllMenus(event) {
    if (event && event.target !== event.currentTarget) return; 
    const menus = ["helpMenu", "gameMenu", "statsPopup", "powerMenu", "systemMenu", "settingsMenu"];
    menus.forEach(menuId => {
        if(gebid(menuId)) gebid(menuId).className = "closedMenu";
    });
}

function openHelpMenu(){ closeAllMenus(); if(gebid("helpMenu")) gebid("helpMenu").className = "openHelpMenu"; }
function openSystemMenu(){ closeAllMenus(); if(gebid("systemMenu")) gebid("systemMenu").className = "openSysMenu"; }
function openStats(){ closeAllMenus(); if(gebid("statsPopup")) gebid("statsPopup").className = "openMenu"; addStatsToPopup(); }
function showGameOptions(){ closeAllMenus(); if(gebid("gameMenu")) gebid("gameMenu").className = "openGameMenu"; }
function openSettings(){ closeAllMenus(); if(gebid("settingsMenu")) gebid("settingsMenu").className = "openGearMenu"; }
function showPowerOptions(){ closeAllMenus(); if(gebid("powerMenu")) gebid("powerMenu").className = "openPowMenu"; }

var maxForBar = 0, currentProgress = 0;
var activeTree = null;
var currentFolderID = -1;

function startGame(gameID){
    gebid("fileExplorer").className = "fileExplorer";
    currentFolderID = -1;
    currentProgress = 0;
    
    var tree;
    if(gameID == 3 || gameID == 6 || gameID == 9) { maxForBar = 4; tree = createTree(8); }
    else if(gameID == 2 || gameID == 5 || gameID == 8) { maxForBar = 3; tree = createTree(7); }
    else { maxForBar = 2; tree = createTree(6); }
    
    activeTree = tree;
    for(var i = 0; i < maxForBar; i++){
        let folderNode = null;
        let attempts = 0;
        while(!folderNode && attempts < 100) {
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
                fileSize: getRandomNumber(100) + 1
            });
        }
    }
    for(var j = 0; j < (tree[0].inside.length * 2); j++){
        let folderNode = null;
        let attempts = 0;
        while(!folderNode && attempts < 100) {
            let testNode = findNodeById(tree, getRandomNumber(globalIdCounter));
            if(testNode && testNode.inside && Array.isArray(testNode.inside)) {
                folderNode = testNode;
            }
            attempts++;
        }
        
        if(folderNode) {
            folderNode.inside.push({
                Name: fileNames[getRandomNumber(fileNames.length)],
                inside: null,
                depth: folderNode.depth + 1,
                id: globalIdCounter++,
                fileSize: getRandomNumber(100) + 1
            });
        }
    }
    updateFileExplorer(activeTree, currentFolderID);
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
        log("Found System Helper Link!");
        if(currentProgress === maxForBar){
            if(typeof win === "function") win();
            else log("You Win! (win() function triggered)");
        }
    } else {
        log("Opened file: " + node.Name);
    }
}

function openFolder(id){
    updateFileExplorer(activeTree, id);
}

let lastInside = null;
function updateFileExplorer(tree, currentID){
    var targetNode = findNodeById(tree, currentID);
    if (!targetNode || !targetNode.inside) return;
    
    var insert = "";
    var newtBody = document.createElement("tbody");
    
    for(var i = 0; i < targetNode.inside.length; i++){
        var item = targetNode.inside[i];
        var isFolder = item.inside !== null;
        
        var actionButton = isFolder ? 
            `<button class='clickButton' onclick='openFolder(${item.id})'>Go Inside Folder</button>` : 
            `<button class='clickButton' onclick='openFile(${item.id})'>Open</button>`;
            
        var isExecutable = (isFolder || item.Name.includes(".mp3") || item.Name.includes(".exe")) ? "Yes" : "No";
        var isCorrectSystemFile = (item.Name.toLowerCase() === "correct.exe" || item.Name === "Bonus.exe") ? "Yes" : "IDK, you choose";
        
        insert += `<tr><td>` +actionButton + `</td><td>` + item.Name + `</td><td>` + item.fileSize + `MB</td><td>${isExecutable}</td><td>${isCorrectSystemFile}</td></tr>`;
    }
    log("frame")
    if(currentFolderID != -1){
    insert += "<tr><td> + <button onclick='openFolder(" + findNodeById(tree, currentFolderID).parent.id + ")'>Return up 1 Folder</button></td></tr>";}
    newtBody.id = "tBodyMainExplorer";
    newtBody.innerHTML = insert;
    
    if(lastInside !== newtBody.innerHTML){
        gebid("tBodyMainExplorer")?.remove();
        lastInside = newtBody.innerHTML;
        gebid("fileShower")?.appendChild(newtBody);
    }
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

function createFolderNesting(depth, max){
    if (max <= 0 || depth > 4) return null;
    var inside = []; 
    let randomForFor = (getRandomNumber(max/2) + 0.5 * max);
    for(let i = 0; i < randomForFor; i++){ 
        const childFolder = createFolderNesting(depth + 1, max - 1);
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
        id: globalIdCounter++,
        fileSize: addedFileSize
    };
}

function createTree(maxDepth){
    globalIdCounter = 0;
    var out = [{Name: "User", inside: [], depth:0, id: -1}];
    for(let i = 0; i < maxDepth; i++){ 
        var out2 = createFolderNesting(1, 3);
        if(out2) out[0]["inside"].push(out2);
    }
    return out;
}

document.addEventListener("DOMContentLoaded", () => {
    var xButtons = document.querySelectorAll(".closeMenusX");
    xButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        button.parentElement.classList.add("closedMenu");
      });
    });

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
});

const fileNames = ["Random.exe", "Log.txt", "Error.exe", "Game.exe", "Bonus.exe", "CheeseNoise.mp3", "RUSHE.mp3", "Music-Player.exe", "Broken.???", "Nothing.non", "recursion.exe"];
const randomFolderList = ["Main", "Main2", "Gameyz", "MT", "ActuallyImportantFiles", "PrivateStuff", "Secret", "InHere", "IDKWhatToPutHere", "DevSaysHi", "Thingies"];

function beginCode(){
    updateTime();
    setInterval(updateTime, 1000);
    console.log("You should not be here...");
}