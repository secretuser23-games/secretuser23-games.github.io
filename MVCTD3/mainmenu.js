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
function openMenu(menu){
    if(menu == "playGame"){
        gebid("playGame").classList = "fscMenu";
    }
}
function openSingularMenu(menu){
    if(menu == "gameOptions"){
        closeAllMenus();
        openMenu("playGame");
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