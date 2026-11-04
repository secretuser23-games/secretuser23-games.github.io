//Projectile info and array

var projectileData = {
    Normal: {
        t00: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")},
    }, 
    farm: {
        0: {Type: "Farm", projSpeed: 125, image: initImage("projectiles/farm/farm.png")}
    },
    fire: {
        basic: {Type: "Fire", projSpeed: 30, image: initImage("projectiles/fire/fire.png")}
    }
};
var projectileList = [];
//Draws projectiles
function drawProjectiles(){
    //As long as the code exists, the rest will work.
    if(typeof projectileList === 'undefined' || !projectileList) return;
    
    
    //For each enemy:
    for (var i = projectileList.length - 1; i >= 0; i--) {
        
        //get projectile info and make  it a base variable
        var proj = projectileList[i];
        
        //If type is the normal claw:
        if(proj.Type == projectileData.Normal.t00){
            
            //Get x any y position update
            proj.x += Math.cos(proj.direction) * proj.Type.projSpeed;
            proj.y += Math.sin(proj.direction) * proj.Type.projSpeed;
            
            //If iff-screen, delete
            if (proj.x < -100 || proj.x > 1100 || proj.y < -100 || proj.y > 1100) {
                projectileList.splice(i, 1);
                continue;
            }
            
            //Draws the image
            drawImg(proj.Type.image, proj.x, proj.y, 62.5, 62.5, proj.direction);
            
            //Sets has hit enemy to false
            var hitEnemy = false;
            
            //For each enemy: 
            for (var j = enemyStats.length - 1; j >= 0; j--) {
                
                //Get their distance to the projectile
                var distance = findDist(proj.x, proj.y, enemyStats[j].x, enemyStats[j].y);
                
                //If in striking range:
                if (distance <= 31.25) {
                    
                    //If damage code exists, set to amount, Otherwise set to 1 as backup
                    var dmg = proj.damage ? proj.damage : 1;
                    
                    //Update enemy damage taken
                    enemyStats[j].damageTaken += dmg;
                    
                    //If projectile has explosion
                    if(proj.explosion){
                        
                        //For each enemy: If they are close enough, up by 1 damage
                        for(var k=0; k<enemyStats.length; k++){if(findDist(proj.x, proj.y, enemyStats[k].x, enemyStats[k].y) <= 50){enemyStats[k].damageTaken++;}}
                        
                        //Push the image of the explosion
                        effects.push({
                            image: [clawExplosion, clawExplosion, clawExplosion, clawExplosion2, clawExplosion2, clawExplosion2, clawExplosion3, clawExplosion3, clawExplosion3, clawExplosion4, clawExplosion4, clawExplosion4, clawExplosion5, clawExplosion5, clawExplosion5, clawExplosion6, clawExplosion6, clawExplosion6, clawExplosion7, clawExplosion7, clawExplosion7, clawExplosion8, clawExplosion8, clawExplosion8],
                            x: proj.x, 
                            y: proj.y, 
                            height: 62.5, 
                            width: 62.5, 
                            rotation: proj.rotation, 
                            opacity: 1, 
                            frame: 0
                        });
                    }
                    
                    //Break projectile
                    projectileList.splice(i, 1);
                    hitEnemy = true;
                    break;
                }
            }
            if (hitEnemy) continue;
        }
        //If projectile type is the farm:
        else if(proj.Type == projectileData.farm[0]){
            
            //If distance to mouse is close enough:
            if(findDist(proj.x, proj.y, mouseX, mouseY) <= 250){
                
                //Up money and delete projectile
                money += proj.damage;
                proj.splice(i,1);
            }
            else{
                //As long as the projectile is there, draw the image.
                drawImg(projectileData.farm[0].image, proj.x, proj.y, 62.5, 62.5, 0);
            }
        }
         //If type is fire:
        else if(proj.Type == projectileData.fire.basic){
            // Get x and y position update
            proj.x += Math.cos(proj.direction) * proj.Type.projSpeed;
            proj.y += Math.sin(proj.direction) * proj.Type.projSpeed;
        
            // If off-screen, delete and break tracking safely
            if (proj.x < -100 || proj.x > 1100 || proj.y < -100 || proj.y > 1100) {
                projectileList.splice(i, 1);
                continue;
            }
        
            // Draws the image
            drawImg(proj.Type.image, proj.x, proj.y, 62.5, 62.5, proj.direction);
            
            var hitSomething = false;

            // Loop backwards safely to prevent missing dynamic index checks
            for(var l = enemyStats.length - 1; l >= 0; l--){
                // Find the distance to the enemy
                var distanceFire = findDist(proj.x, proj.y, enemyStats[l].x, enemyStats[l].y);
                
                // If in range of hitting
                if(distanceFire <= 31.25){
                    // Add "burning" debuff
                    enemyStats[l].debuffs.push({
                        name: "burning",
                        length: 180,
                        damage: proj.damage
                    });
                    
                    if(proj.explosion >= 1){
                        enemyStats[l].debuffs.push({name: "burningSlow", length: 180, speed: 0.9});
                    }
                    
                    // If the fire is set to explode:
                    if(proj.explosion >= 2){
                        // Push the image of the explosion
                        effects.push({
                            image: [clawExplosion, clawExplosion, clawExplosion, clawExplosion2, clawExplosion2, clawExplosion2, clawExplosion3, clawExplosion3, clawExplosion3, clawExplosion4, clawExplosion4, clawExplosion4, clawExplosion5, clawExplosion5, clawExplosion5, clawExplosion6, clawExplosion6, clawExplosion6, clawExplosion7, clawExplosion7, clawExplosion7, clawExplosion8, clawExplosion8, clawExplosion8],
                            x: proj.x, 
                            y: proj.y, 
                            height: 62.5, 
                            width: 62.5, 
                            rotation: proj.rotation, 
                            opacity: 1, 
                            frame: 0
                        });

                        // Damage splash check for nearby target boundaries
                        for(var m = 0; m < enemyStats.length; m++){
                            if(findDist(proj.x, proj.y, enemyStats[m].x, enemyStats[m].y) <= 50){
                                enemyStats[m].damageTaken++;
                                if(proj.explosion == 3){
                                    enemyStats[m].debuffs.push({name: "burning-sideExplosion", length: 120, damage: 1});
                                }
                            }
                        }
                    }
                    
                    // Set flag to handle projectile teardown outside inner loops
                    hitSomething = true;
                    break; 
                }
            }

            // Safely delete the projectile if a target was pierced
            if (hitSomething) {
                projectileList.splice(i, 1);
                continue;
            }
        }
    }
}

//Creates projectiles
function createProjectile(x,y,direction,towType, level, calculatedDamage, explosionCheck = false){
    projectileList.push({
        Type: projectileData[towType][level],
        x: x*62.5,
        y: y*62.5,
        direction: direction,
        damage: calculatedDamage,
        explosion: explosionCheck
    }
    );}