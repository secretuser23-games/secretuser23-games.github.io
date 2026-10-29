var currentVersion = "devX.6.0";
function gebid(gebid){
    return document.getElementById(gebid);
}
function closeAllMenus(){
    const fscMenus = document.querySelectorAll(".fscMenu");
    fscMenus.forEach(element => {
        element.classList.remove("fscMenu");
        element.classList.add("closedMenu");
    });
}
function getSaveDataInfo(lsID){
    if(!lsID || lsID === undefined){alert("Error when getting save data: Get data string is either null or undefined.");}
    var getItem = JSON.parse(localStorage.getItem(lsID));
    if(getItem === null || getItem === undefined){alert(`Error when getting save data: The localStorage.getItem(${lsID}) is corrupted or empty.`); return null;}
    return getItem;
}
function openMenu(menu){
        gebid(menu).classList = "fscMenu";
}
function openSingularMenu(menu){
    closeAllMenus();
    if(menu == "gameOptions"){
        openMenu("playGame");
    }
    else if(menu == "settingsMenu"){
        populateSettingsMenu();
        openMenu("settingsMenu");
    }
}
function confirmClose(){
    var exit = confirm("Do you want to exit the game? Doing this will send you to google.com.");
    if(exit){
        window.location.href="https://www.google.com";
    }
    else{
        return;
    }
}

function openMap(mapID){
    var open = confirm("Do you want to play the game with Map ID of " + mapID + "?");
    if(open){
        localStorage.setItem("mvctd3-chosenMap", mapID);
        window.location.href="game.html";
    }
}
if(localStorage.getItem("mvctd3-settings") === null){
    alert("Welcome to Mice Vs. Cats TD Version 3! To start, choose a map (I recommend the first one) and continue to playing! Or, if you want, go to the Settings to toggle a few things."); 
    settings = {showTutorial: true, sidebarHexBackgroundColor: "#a52a2a", sidebarHexTextColor: "#ffffff", bodyBackgroundTextColor: "#888888", currentVersion: currentVersion};
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
}
var settings = getSaveDataInfo("mvctd3-settings");
if(settings.currentVersion != currentVersion){
    alert ("New version found! Some settings could be wrong, so give us a couple seconds to fill in what's missing.");
    if(!settings.sidebarHexBackgroundColor){settings.sidebarHexBackgroundColor = "#a52a2a";}
    else if(!settings.sidebarHexTextColor){settings.sidebarHexTextColor = "#ffffff";}
    else if(!settings.buttonHexBackgroundColor){settings.buttonHexBackgroundColor = "#4caf50";}
    else if(!settings.buttonHexTextColor){settings.buttonHexTextColor = "#ffffff";}
    else if(!settings.bodyBackgroundTextColor){settings.bodyBackgroundTextColor = "#888888";}
    else if(!settings.showTutorial){settings.showTutorial = true;}
    settings.currentVersion = currentVersion;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
}
function populateSettingsMenu(){
    if(settings == null || settings == undefined){alert("Settings is either empty or corrupted. Reverting back to original settings..."); settings = {showTutorial: true, sidebarHexBackgroundColor: "#a52a2a", sidebarHexTextColor: "#ffffff", buttonHexBackgroundColor: "#4caf50", buttonHexTextColor: "#ffffff", bodyBackgroundTextColor: "#888888", currentVersion: currentVersion};localStorage.setItem("mvctd3-settings", JSON.stringify(settings));}
    if(settings.showTutorial == true){
    gebid("tutorialAlertsToggle").src="images/toggle/1.png";
    }
    else if(settings.showTutorial == false){
        gebid("tutorialAlertsToggle").src="images/toggle/10.png";
    }
    gebid("sBarBGHEX").value = settings.sidebarHexBackgroundColor;
    gebid("sBarTCHEX").value = settings.sidebarHexTextColor;
    gebid("uiBtnBGHEX").value = settings.buttonHexBackgroundColor;
    gebid("uiBtnTCHEX").value = settings.buttonHexTextColor;
    gebid("bodyBGHEX").value = settings.bodyBackgroundTextColor;
}
function toggleSetting(settingID){
    settings = getSaveDataInfo("mvctd3-settings");
    if(settingID == "tutorialAlerts"){
        if(settings.showTutorial == false){
            settings.showTutorial = true;
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/9.png"), 25);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/8.png"), 50);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/7.png"), 75);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/6.png"), 100);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/5.png"), 125);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/4.png"), 150);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/3.png"), 175);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/2.png"), 200);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/1.png"), 225);
        }
        else if(settings.showTutorial == true){
            settings.showTutorial = false;
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/2.png"), 25);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/3.png"), 50);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/4.png"), 75);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/5.png"), 100);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/6.png"), 125);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/7.png"), 150);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/8.png"), 175);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/9.png"), 200);
            setTimeout(() => setImageToSrc("tutorialAlertsToggle", "images/toggle/10.png"), 225);
        }
    }
    setTimeout(() => {localStorage.setItem("mvctd3-settings", JSON.stringify(settings)); populateSettingsMenu();}, 250);
}
function setImageToSrc(image, srcLink){
    gebid(image).src=srcLink;
}

gebid("sBarBGHEX").addEventListener("input", (event) => {
    const hexValue = event.target.value;
    settings.sidebarHexBackgroundColor = hexValue;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
    populateSettingsMenu();
});

gebid("sBarTCHEX").addEventListener("input", (event) => {
    const hexValue = event.target.value;
    settings.sidebarHexTextColor = hexValue;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
    populateSettingsMenu();
});
gebid("uiBtnBGHEX").addEventListener("input", (event) => {
    const hexValue = event.target.value;
    settings.buttonHexBackgroundColor = hexValue;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
    populateSettingsMenu();
});

gebid("uiBtnTCHEX").addEventListener("input", (event) => {
    const hexValue = event.target.value;
    settings.buttonHexTextColor = hexValue;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
    populateSettingsMenu();
});
gebid("bodyBGHEX").addEventListener("input", (event) => {
    const hexValue = event.target.value;
    settings.bodyBackgroundTextColor = hexValue;
    localStorage.setItem("mvctd3-settings", JSON.stringify(settings));
    populateSettingsMenu();
});
function resetSettings(){
    var choice = confirm("Are you sure you want to reset settings?");
    if(choice == true){settings = {showTutorial: true, sidebarHexBackgroundColor: "#a52a2a", sidebarHexTextColor: "#ffffff", buttonHexBackgroundColor: "#4caf50", buttonHexTextColor: "#ffffff", bodyBackgroundTextColor: "#888888", currentVersion: currentVersion};localStorage.setItem("mvctd3-settings", JSON.stringify(settings));location.reload();}}