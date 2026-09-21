var fakeFileSystem = [{type:"folder", name:"testFolder", subContents: ["test"]}]
var currentLevel = 1;
var currentFolder = "mainFolder"
function gebid(input){
    return document.getElementById(input);
}

function log(what){
    var out = document.createElement("p");
    out.innerHTML = what;
    gebid("logs").appendChild(out);
}
document.cookie = "levels=[1]; path=/;";
document.cookie = "percentToNewOS=0; path=/;";
document.cookie = "currentOS=1; path=/;";

function getCookieValue(name) {
  const cookieString = document.cookie.replace(/;\s*/g, '&');
  const searchParams = new URLSearchParams(cookieString);
  return searchParams.get(name);
}

function getStats(what, whatToAppendTo){
    whatToAppendTo.innerHTML = "";
    var out = document.createElement("div");
    if(what == "all"){
        var levelsArray = JSON.parse(getCookieValue("levels")); 
        var currentOSIndex = parseInt(getCookieValue("currentOS"), 10); 
        out.innerHTML = "<p>Current Level: " + levelsArray[(currentOSIndex - 1)] + "</p>";
    }
    whatToAppendTo.appendChild(out);
    return out;
}
function openSystemMenu(){
    gebid("systemMenu").classList.toggle("openSysMenu");
    gebid("systemMenu").classList.toggle("closedMenu");
    gebid("gameMenu").classList = "closedMenu";
    gebid("statsPopup").classList = "closedMenu";
    gebid("powerMenu").classList = "closedMenu";
}
function openStats(){
        gebid("statsPopup").classList.toggle("openMenu");
        gebid("statsPopup").classList.toggle("closedMenu");
        gebid("gameMenu").classList = "closedMenu";
        gebid("powerMenu").classList = "closedMenu";
        gebid("systemMenu").classList = "closedMenu";
        getStats("all", gebid("statsPopup"));
}
function showGameOptions(){
    gebid("gameMenu").classList.toggle("openGameMenu");
    gebid("gameMenu").classList.toggle("closedMenu");
    gebid("statsPopup").classList = "closedMenu";
    gebid("powerMenu").classList = "closedMenu";
    gebid("systemMenu").classList = "closedMenu";
}
function showPowerOptions(){
    gebid("powerMenu").classList.toggle("openPowMenu");
    gebid("powerMenu").classList.toggle("closedMenu");
    gebid("gameMenu").classList = "closedMenu"
    gebid("statsPopup").classList = "closedMenu";
    gebid("systemMenu").classList = "closedMenu";
}
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
function updateTime() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString();
}
updateTime();
setInterval(updateTime, 1000);