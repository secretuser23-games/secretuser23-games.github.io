//Tower information

var towerLists = {
    basic: {type: "basic", 
        image: initImage("towers/Normal.png"), 
        speed:60, 
        damage: 1, 
        range: 250, 
        baseCost: 150, 
        specialCosts: [500, 1000, 2000], 
        specialUpgrades: [
            "Fires three claws at a time instead of one", 
            "Claws create a small explosion when they hit a target. Explosions deal 1 damage and can hit the original enemy too", 
            "Fires 5 claws at a time! How many claws do these cats have?", 
            "Maximum upgrades have been unlocked in this path"]
        }, 
    music: {type: "music", 
        image: initImage("towers/music.png"), 
        speed:120, 
        damage: 1, 
        range: 125, 
        baseCost: 300, 
        specialCosts: [1000, 2000, 3500],
        specialUpgrades: [
            "Incresese claw amount to 12", 
            "Increases claw amount to 16!", 
            "Claws create a small explosion when they hit a target. Explosions deal 1 damage and can hit the original enemy too", 
            "Maximum upgrades have been unlocked in this path"]
        }, 
    super: {type: "super", 
        image: initImage("towers/super.png"), 
        speed:15, 
        damage: 1, 
        range: 300, 
        baseCost: 500, 
        specialCosts: [1500, 2000, 5000], 
        specialUpgrades: [
            "Fires three claws at a time instead of one", 
            "Claws create a small explosion when they hit a target. Explosions deal 1 damage and can hit the original enemy too", 
            "Fires 5 claws at a time! How many claws do these cats have?", 
            "Maximum upgrades have been unlocked in this path"]
    }, 
    boat: {type: "boat", 
        image: initImage("towers/boat.png"), 
        speed:60, 
        damage: 1, 
        range: 200, 
        baseCost: 200, 
        specialCosts: [250, 500, 750], 
        specialUpgrades: [
            "Utilises the second cannon to fire a claw directly backwards from the target", 
            "Claws create a small explosion when they hit a target. Explosions deal 1 damage and can hit the original enemy too", 
            "Gains a minigun to deal 1 extra damage to the target every attack", 
            "Maximum upgrades have been unlocked in this path"]
        },
        farm: {type: "farm", 
        image: initImage("towers/farm.png"), 
        speed:60, 
        damage: 1, 
        range: 2000, 
        baseCost: 1000, 
        specialCosts: [1000, 3000, 5000], 
        specialUpgrades: [
            "Makes you a free 50 dollars at the end of the round, no matter the other upgrades.", 
            "Automatically collects the drops for you.", 
            "Every other Farm gains 5 dollars per drop (equivalent to 1 damage upgrade). Can stack additively.", 
            "Maximum upgrades have been unlocked in this path"]
        }
    }
var towerArray = []
function checkForTargetedEnemy(towerX, towerY, targetPriority, range){
    var out = null; 
    var tPx = towerX * 62.5+31.25;
    var tPy = towerY * 62.5+31.25;

    for(var i = 0; i < enemyStats.length; i++){
        if(findDist(tPx, tPy, enemyStats[i]["x"], enemyStats[i]["y"]) <= range){
            out = i;
            break;
        }
    }
    return out;
}

//Allows tower to target enemies
function findTargetToFireAt(targetPriority, towerPixelX, towerPixelY, enemyID){
    var enemy = enemyStats[enemyID];
    if(enemy != undefined){
        var offsetX = 0;
        var offsetY = 0;
        clearLogs();
        log(towerPixelX + " " +enemy["x"])
        if(enemy["direction"] == Math.PI) {
            offsetX = -31.25; 
            offsetY = -31.25;
        } else if(enemy["direction"] == Math.PI*0.5) {
            offsetX = -31.25;
            offsetY = -31.25;
        } else if(enemy["direction"] == Math.PI*1.5) {
            offsetX = -31.25;
            offsetY = -31.25;
        } else if(enemy["direction"] == 0 || enemy["direction"] == Math.PI*2) {
            offsetX = 125;
            offsetY = 62.5;
        }

        return getAngleToTarget(
            towerPixelX, 
            towerPixelY, 
            enemy["x"] + offsetX, 
            enemy["y"] + offsetY
        );
    } else {
        return null;
    }
}

//Update tower info
//Also why is the projectile spawning so long!!
function updateTowerStats(){
    //For each tower:
    for(var i = 0; i < towerArray.length; i++){
        //Get info
        var tower = towerArray[i];
        //Check if is farm, and then dont rotate if that is the answer
        if(tower["type"] == towerLists["farm"]){
            target = 1;
            tower["direction"] = 0;
        }
        //Draw tower
        drawImg(tower["type"]["image"], tower["x"] * 62.5+31.25, tower["y"] * 62.5+31.25, 62.5, 62.5, tower["direction"]);
        if (tower["reloadTime"] > 0) {
            tower["reloadTime"]--;
        }
        
        var targetedEnemy = null;
        if(enemyStats && enemyStats.length > 0){
            targetedEnemy = checkForTargetedEnemy(tower["x"], tower["y"], "first", (tower["type"]["range"] *1.25 ** tower["level"][1]));
        }
        if(targetedEnemy === null || targetedEnemy === undefined) {
            if(tower["reloadTime"] <= 0) {
                tower["reloadTime"] = 1;
            }
            continue;
        }
        var towerPixelX = tower["x"] * 62.5;
        var towerPixelY = tower["y"] * 62.5;
        if(tower["type"] != towerLists["farm"]){
            var target = findTargetToFireAt("first", towerPixelX, towerPixelY, targetedEnemy);}
        //Make shorter ASAP, as is too long
        if(target !== null){
            tower["direction"] = target;
            if(tower["type"] == towerLists["boat"]){
                tower["direction"] += 0.5*Math.PI;
            }
            if(tower["reloadTime"] <= 0){
                tower["reloadTime"] = tower["type"]["speed"]*0.8**tower["level"][0];
                if(tower["type"] == towerLists.music){
                    if(tower["level"][3] == 0){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.25*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.5*Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.75*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5,      Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.25*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.5*Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.75*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 1){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (1/6)*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (1/3)*Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.5*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (2/3)*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (5/6)*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (7/6)*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (4/3), "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.5*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (5/3)*Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, (11/6)*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 2*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 2){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.125*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.25 *Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.375*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.5  *Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.625*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.75 *Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.875*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5,       Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.125*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.25 *Math.PI , "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.375*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.5  *Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.625*Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.75 *Math.PI, "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.875*Math.PI, "Normal", "t00", tower["level"][2]+1);

                    }
                    else if(tower["level"][3] == 3){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.125*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.25 *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.375*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.5  *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.625*Math.PI, "Normal", "t00", tower["level"][2]+1, true);//bruh
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.75 *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0.875*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5,       Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.125*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.25 *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.375*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.5  *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.625*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.75 *Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 1.875*Math.PI, "Normal", "t00", tower["level"][2]+1, true);

                    }

                }
                else if(tower["type"] == towerLists.basic){
                    if(tower["level"][3] == 0){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 1){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 2){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }
                    else if(tower["level"][3] == 3){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.05*Math.PI, "Normal", "t00", tower["level"][2]+1, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.05*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }
                }
                else if(tower["type"] == towerLists.boat){
                    if(tower["level"][3] == 0){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.5*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 1){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.5*Math.PI, "Normal", "t00", tower["level"][2]+1); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+1.5*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 2){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.5*Math.PI, "Normal", "t00", tower["level"][2]+1, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+1.5*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }
                    else if(tower["level"][3] == 3){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.5*Math.PI, "Normal", "t00", tower["level"][2]+2, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+1.5*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }
                }
                else if(tower["type"] == towerLists.super){
                    if(tower["level"][3] == 0){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 1){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1);
                    }
                    else if(tower["level"][3] == 2){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }
                    else if(tower["level"][3] == 3){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]+0.05*Math.PI, "Normal", "t00", tower["level"][2]+1, true); 
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"], "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.05*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, tower["direction"]-0.1*Math.PI, "Normal", "t00", tower["level"][2]+1, true);
                    }

                }
                else if(tower["type"] == towerLists.farm){//Odd one out
                    if(tower["level"][3] == 0){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "farm", 0, (tower["level"][2]+1)*5+(farmsBuffExtraMoney*5))
                    }
                    else if(tower["level"][3] == 1){
                        createProjectile(tower["x"]+0.5, tower["y"]+0.5, 0, "farm", 0, (tower["level"][2]+1)*5+(farmsBuffExtraMoney*5))
                    }
                    else if(tower["level"][3] == 2){
                        money += (tower["level"][2]+1)*5+(farmsBuffExtraMoney*5);
                    }
                    else if(tower["level"][3] == 3){
                        money += (tower["level"][2]+1)*5+(farmsBuffExtraMoney*5);
                    }
                }
                
            }
        }
    }
}

//Tower placing info
function attemptPlaceTower(){
    if(isPlacingTower){
        var location = trackInfo[placementY][placementX]
        if(location["tower"] == true){
            alert("There is already a tower there! Please pick another location.")
        }
        else if(location["typeTrack"] == grassRock){
            alert("Cannot place on top of rocks!")
        }
        else if(location["typeTrack"] == water || location["typeTrack"] == deepWater){
            if(towerBeingPlacedType == 2 && money >= 250){
                money -= 250;
                towerArray.push({
                type: towerLists["boat"], 
                x:placementX, 
                y:placementY, 
                direction: Math.PI, 
                reloadTime: towerLists["boat"]["speed"],
                level: [0,0,0,0,false],
                ID: globalTowerID++})
                isPlacingTower =  false;
            }
            else if(money < 250 && towerBeingPlacedType == 2){
                alert("Not enough money to place! Cost is 250 btw")
            }
            else{
                alert("Cannot place land type tower in water!")
            }
        }
        else if(location["track"] == true){
            alert("This is a road part, you cannot place here!")
        }
        else if(towerBeingPlacedType == 0 && money < 150){
            alert("Not enough money to place down! Cost is 150 btw")
        }
        else if(towerBeingPlacedType == 1 && money < 300){
            alert("Not enough money to place down! Cost is 300 btw")
        }
        else if(towerBeingPlacedType == 2 && money < 250){
            alert("Not enough money to place down! Cost is 250 btw")
        }
        else if(towerBeingPlacedType == 3 && money < 500){
            alert("Not enough money to place down! Cost is 500 btw")
        }
        else if(towerBeingPlacedType == 4 && money < 1000){
            alert("Not enough money to place down! Cost is 1000 btw")
        }
        else{
            location["tower"] = true;
            if(towerBeingPlacedType == 0){
                money -= 150;
                towerArray.push({
                type: towerLists["basic"], 
                x:placementX, 
                y:placementY, 
                direction: Math.PI, 
                reloadTime: towerLists["basic"]["speed"],
                level: [0,0,0,0,false],
                ID: globalTowerID++})
                isPlacingTower =  false;
                }
            else if(towerBeingPlacedType == 4){
                money -= 1000;
                towerArray.push({
                type: towerLists["farm"], 
                x:placementX, 
                y:placementY, 
                direction: 0, 
                reloadTime: towerLists["farm"]["speed"],
                level: [0,0,0,0,false],
                ID: globalTowerID++})
                isPlacingTower =  false;
                }
            else if(towerBeingPlacedType == 1){
                money -= 300;
                towerArray.push({
                type: towerLists["music"], 
                x:placementX, 
                y:placementY, 
                direction: Math.PI, 
                reloadTime: towerLists["music"]["speed"],
                level: [0,0,0,0,false],
                ID: globalTowerID++})
                isPlacingTower =  false;
                }
            else if(towerBeingPlacedType == 2){
                alert("This is a water tower, it cannot go on the land!")
            }
            else if(towerBeingPlacedType == 3){
                money -= 500;
                towerArray.push({
                type: towerLists["super"], 
                x:placementX, 
                y:placementY, 
                direction: Math.PI, 
                reloadTime: towerLists["super"]["speed"],
                level: [0,0,0,0,false],
                ID: globalTowerID++})
                isPlacingTower =  false;
            }
        }
    }
}

//Alerts tower information
function openStatsMenu(){
    var alertMessage = "Statistics for this tower: \n"
    alertMessage += ("Speed (how long in between firing its attack in seconds): " + (towerArray[towerOpenedID]["type"]["speed"]/60)*0.8**towerArray[towerOpenedID]["level"][0] + "\n")
    alertMessage += ("Range (each square is 1 in this case): " + towerArray[towerOpenedID]["type"]["range"]/62.5* 1.25 ** towerArray[towerOpenedID]["level"][1] + "\n")
    alertMessage += ("Damage (maximum): " + (towerArray[towerOpenedID]["type"]["damage"] + towerArray[towerOpenedID]["level"][2]) + "\n")
    alertMessage += ("Special Level: " + (towerArray[towerOpenedID]["level"][3] + "\n"))
    alertMessage += ("Is Merged: No (will add later)")
    alert(alertMessage)
}
//Buying upgrades : Speed, Range, Damage, and Special
function attemptBuySpeedUpgrade(){
    if(towerArray[towerOpenedID]["level"][0] != 3 && money >= Math.floor(towerArray[towerOpenedID].type.baseCost* 1.5 ** (towerArray[towerOpenedID]["level"][0]+1))){
        money -= Math.floor(towerArray[towerOpenedID].type.baseCost* 1.5 ** towerArray[towerOpenedID]["level"][0]);
    towerArray[towerOpenedID]["level"][0]++;}
    else if(money < Math.floor(towerArray[towerOpenedID].type.baseCost* 1.5 ** (towerArray[towerOpenedID]["level"][0]+1))){alert("Not enough money: Cost is " + Math.floor(towerArray[towerOpenedID].type.baseCost* 1.5 ** (towerArray[towerOpenedID]["level"][0]+1)))}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function attemptBuyRangeUpgrade(){
    if(towerArray[towerOpenedID]["level"][1] != 3 && money >= Math.floor(towerArray[towerOpenedID].type.baseCost* 1.1 ** (towerArray[towerOpenedID]["level"][1]+1))){
        money -= Math.floor(towerArray[towerOpenedID].type.baseCost* 1.1 ** towerArray[towerOpenedID]["level"][1]);
    towerArray[towerOpenedID]["level"][1]++;}
    else if(money < Math.floor(towerArray[towerOpenedID].type.baseCost* 1.1 ** (towerArray[towerOpenedID]["level"][1]+1))){alert("Not enough money: Cost is " + Math.floor(towerArray[towerOpenedID].type.baseCost* 1.1 ** (towerArray[towerOpenedID]["level"][1]+1)))}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function attemptBuyDamageUpgrade(){
    if(towerArray[towerOpenedID]["level"][2] != 3 && money >= towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][2]+1)){
        money -= towerArray[towerOpenedID].type.baseCost* 2 ** towerArray[towerOpenedID]["level"][2];
    towerArray[towerOpenedID]["level"][2]++;}
    else if(money < towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][2]+1)){alert("Not enough money: Cost is " + towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][2]+1))}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}
function attemptBuySpecialUpgrade(){
    log(towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]])
    if(towerArray[towerOpenedID]["level"][3] != 3 && money >= towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]]){
        money -= towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]];
        towerArray[towerOpenedID]["level"][3]++;
        if(towerArray[towerOpenedID]["type"] == towerLists.farm && towerArray[towerOpenedID]["level"][3] == 3){farmsBuffExtraMoney++;} else if(towerArray[towerOpenedID]["type"] == towerLists.farm && towerArray[towerOpenedID]["level"][3] == 1){eorMoney++;}
    }
    else if(money < towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]]){alert("Not enough money: Cost is " + towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]])}
    else{alert("Max level reached!")}
    updateSidebarUI(towerArray[towerOpenedID])
}

//Update upgrade sidebar info
function updateSidebarUI(tower) {
    var sidebar = gebid("towerSidebar");
    gebid("specialButton").title = tower.type["specialUpgrades"][tower.level[3]]
    if (sidebar) sidebar.style.display = "block";
    var speedVal = ((tower.type.speed / 60) * Math.pow(0.8, tower.level[0])).toFixed(2);
    var rangeVal = (tower.type.range / 62.5 * Math.pow(1.25, tower.level[1])).toFixed(1);
    var damageVal = tower.type.damage + tower.level[2];
    gebid("upgradeType").innerHTML = "Tower ID: " + tower.ID
    if (gebid("sidebarTowerName")) gebid("sidebarTowerName").textContent = "Tower Type: " + tower.type.type.toUpperCase();
    if (gebid("sidebarSpeedStat")) gebid("sidebarSpeedStat").textContent = "Attack Delay: " + speedVal + "s (Lv. " + tower.level[0] + ") \n Cost is " + towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][0]+1);
    if (gebid("sidebarRangeStat")) gebid("sidebarRangeStat").textContent = "Tile Range: " + rangeVal + " (Lv. " + tower.level[1] + ")\n Cost is " + towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][1]+1);
    if (gebid("sidebarDamageStat")) gebid("sidebarDamageStat").textContent = "Max Damage: " + damageVal + " (Lv. " + tower.level[2] + ")\n Cost is " + towerArray[towerOpenedID].type.baseCost* 2 ** (towerArray[towerOpenedID]["level"][2]+1);
    if (gebid("sidebarSpecialStat")) gebid("sidebarSpecialStat").textContent = "Special: (Lv. " + tower.level[3] + ")\n Cost is " + towerArray[towerOpenedID].type.specialCosts[towerArray[towerOpenedID]["level"][3]];
}

//Hide upgrade menu
function hideSidebarUI() {
    var sidebar = gebid("towerSidebar");
    if (sidebar) sidebar.style.display = "none";
}