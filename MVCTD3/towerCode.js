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
        }
    }
var towerArray = []