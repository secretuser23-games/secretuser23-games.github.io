function gebid(input){
    return document.getElementById(input);
}

function log(what){
    var out = document.createElement("p");
    out.innerHTML = what;
    gebid("logs").appendChild(out);
}

var globalIdCounter = 0; 
var levels =[0], specs = [`4 MB RAM`, `33 Mhz CPU`, `Integrated GPU`, `9" CRT Screen`]
document.cookie = "levels=" + JSON.stringify(levels) + "; path=/;";
document.cookie = "percentToNewOS=0; path=/;";
document.cookie = "specs=" + JSON.stringify(specs) + "; path=/;"
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
    gebid("currentLevel").innerHTML = "Current Level: " + JSON.parse(getCookieValue("levels"))[0]
    gebid("currentSpecs").innerHTML = "RAM: " + JSON.parse(getCookieValue("specs"))[0] + "<br/>CPU: " + JSON.parse(getCookieValue("specs"))[1] + "<br/>GPU: "+ JSON.parse(getCookieValue("specs"))[2] + "<br/>Screen: " + JSON.parse(getCookieValue("specs"))[3]
}
function closeAllMenus(event) {
    if (event && event.target !== event.currentTarget) {
        return; 
    }

    gebid("helpMenu").className = "closedMenu";
    gebid("gameMenu").className = "closedMenu";
    gebid("statsPopup").className = "closedMenu";
    gebid("powerMenu").className = "closedMenu";
    gebid("systemMenu").className = "closedMenu";
    gebid("settingsMenu").className = "closedMenu";
}
function openHelpMenu(){
    closeAllMenus();
    gebid("helpMenu").classList = "openHelpMenu";
}
function openSystemMenu(){
    closeAllMenus();
    gebid("systemMenu").classList = "openSysMenu";
}
function openStats(){
    closeAllMenus();
        gebid("statsPopup").classList = "openMenu";
        addStatsToPopup();
}
function showGameOptions(){
    closeAllMenus();
    gebid("gameMenu").classList = "openGameMenu";
}
function openSettings(){
    closeAllMenus();
    gebid("settingsMenu").classList = "openGearMenu";
}
function showPowerOptions(){
    closeAllMenus();
    gebid("powerMenu").classList = "openPowMenu";
}
function startGame(gameID){
    gebid("fileExplorer").classList = "fileExplorer";
    if(gameID == 3|| gameID == 6 || gameID == 9){
    var tree = createTree(8)}
    else if(gameID == 2|| gameID == 5 || gameID == 8){
    var tree = createTree(7)}
    else{
    var tree = createTree(6)}
    setInterval(() => gameTick(tree, -1), 10)
}
function gameTick(tree1, currentID1){
    updateFileExplorer(tree1, currentID1);
}
function updateFileExplorer(tree, currentID){
    gebid("tBodyMainExplorer")?.remove();
    var targetNode = findNodeById(tree, currentID);
    if (!targetNode || !targetNode.inside) {
        return;
    }
    
    var insert = "";
    var newtBody = document.createElement("tbody");
    for(var i = 0; i < targetNode.inside.length; i++){
        var item = targetNode.inside[i];
        insert += "<tr><td>" + item.Name + "</td><td>" + item.fileSize+ "MB" + "</td><td>" + ((item.inside!=null||item.Name.includes(".mp3")||item.Name.includes(".exe"))?"Yes":"No")+"</td><td>" +((item.Name.includes == "Correct.exe"||item.Name == "Bonus.exe")?"Yes":"IDK, you choose")+ "</td></tr>";
    }
    
    newtBody.id = "tBodyMainExplorer";
    newtBody.innerHTML = insert;
    gebid("fileShower")?.appendChild(newtBody);
}
function updateTime() {
  const now = new Date();
  const ms = String(now.getMilliseconds()).padStart(3, "0")
  document.getElementById("clock").innerText = now.toLocaleTimeString() + "+ "+ms + " ms";
}
function getRandomNumber(mult){
    return Math.floor(Math.random() * mult); 
}
function findNodeById(tree, targetId){
    for (let node of tree) {
        if (node.id === targetId) {
            return node;
        }
        
        if (node.inside && node.inside.length > 0) {
            const foundInDeepResult = findNodeById(node.inside, targetId);
        
            if (foundInDeepResult) {
                return foundInDeepResult;
            }
        }
    }
    return null; 
}
function createFolderNesting(depth, max){
    if (max <= 0 || depth > 4) return null;
    var inside = []; 
    let randomForFor = getRandomNumber(Math.min(max, 3));
    for(let i = 0; i < randomForFor; i++){ 
        const childFolder = createFolderNesting(depth + 1, max - 1);
        if (childFolder) {
            inside.push(childFolder);
            if(depth >= 2){
                let fileCount = getRandomNumber(2) + 1;
                for(var j=0; j < fileCount; j++){
                    inside.push({
                        Name: fileNames[getRandomNumber(fileNames.length)],
                        inside: null,
                        depth: depth,
                        id: globalIdCounter++ ,
                        fileSize: getRandomNumber(100)
                    });
                }
            }
        }
    }
    var addedFileSize = 1
    for(var i=0; i< inside.length; i++){
        addedFileSize+= inside[i]["fileSize"]
    }
    return {
        Name: randomFolderList[getRandomNumber(randomFolderList.length)], 
        inside: inside, 
        depth: depth,
        id: globalIdCounter++ ,
        fileSize: addedFileSize
    };
}

function createTree(maxDepth){
    globalIdCounter = 0;
    var out = [{Name: "User", inside: [], depth:0, id: -1}];
    for(let i = 0; i < maxDepth; i++){ 
        var out2 = createFolderNesting(1, 3);
        if(out2) {
            out[0]["inside"].push(out2);
        }
    }
    return out;
}
var currentLayer = 0, currentFolder = "main";
var xButtons = document.querySelectorAll(".closeMenusX");
xButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    button.parentElement.classList.add("closedMenu");
  });
});
const fileNames = ["Correct.exe", "Random.exe", "Log.txt", "Error.exe", "Game.exe", "Bonus.exe", "CheeseNoise.mp3", "RUSHE.mp3", "Music-Player.exe", "Broken.???", "Nothing.non", "recursion.exe"]
const randomFolderList = ["Main", "Main2", "Gameyz", "MT", "ActuallyImportantFiles", "PrivateStuff", "Secret", "InHere", "IDKWhatToPutHere", "DevSaysHi", "Thingies"]
gebid("statsMenu").addEventListener("click", function(){ openStats(); });
gebid("startMenu").addEventListener("click", function(){ openSystemMenu(); });
document.body.addEventListener("keydown", function(event){
    if(event.key.toLowerCase() === "d"){
        gebid("logs").classList.toggle("logsOpen");
        gebid("logs").classList.toggle("closedMenu");
    }
    else if(event.key.toLowerCase() === "s"){
        openSystemMenu();
    }
});
function beginCode(){
log("Test Tree: " + JSON.stringify(createTree(6)));
updateTime();
setInterval(updateTime, 10);
console.log("You should not be here...")
}
beginCode();