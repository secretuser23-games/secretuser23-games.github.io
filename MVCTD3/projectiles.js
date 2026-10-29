//Projectile info and array

var projectileData = {
    Normal: {
        t00: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")},
        // ADD THESE NUMERICAL CORES SO LEVEL RETRIEVAL WORKS LEGALLY:
        0: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")},
        1: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")},
        2: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")},
        3: {Type: "Normal-00", projSpeed: 25, image: initImage("projectiles/normal/t00.png")}
    }, 
    farm: {
        0: {Type: "Farm", projSpeed: 125, image: initImage("projectiles/farm/farm.png")},
        1: {Type: "Farm", projSpeed: 125, image: initImage("projectiles/farm/farm.png")},
        2: {Type: "Farm", projSpeed: 125, image: initImage("projectiles/farm/farm.png")},
        3: {Type: "Farm", projSpeed: 125, image: initImage("projectiles/farm/farm.png")}
    }
};
var projectileList = [];

//Draws projectiles
function drawProjectiles(){
    if(typeof projectileList === 'undefined' || !projectileList) return;
    
    for (var i = projectileList.length - 1; i >= 0; i--) {
        if(projectileList[i].Type == projectileData.Normal.t00){
        var proj = projectileList[i];
        proj.x += Math.cos(proj.direction) * proj.Type.projSpeed;
        proj.y += Math.sin(proj.direction) * proj.Type.projSpeed;
        if (proj.x < -100 || proj.x > 1100 || proj.y < -100 || proj.y > 1100) {
            projectileList.splice(i, 1);
            continue;
        }
        drawImg(proj.Type.image, proj.x, proj.y, 62.5, 62.5, proj.direction);
        var hitEnemy = false;
        for (var j = enemyStats.length - 1; j >= 0; j--) {
            var distance = findDist(proj.x, proj.y, enemyStats[j].x, enemyStats[j].y);
            if (distance <= 31.25) {
                var dmg = proj.damage ? proj.damage : 1;
                enemyStats[j].damageTaken += dmg;
                if(proj.explosion){
                    for(var k=0; k<enemyStats.length; k++){if(findDist(proj.x, proj.y, enemyStats[k].x, enemyStats[k].y) <= 50){enemyStats[k].damageTaken++;}}
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
                projectileList.splice(i, 1);
                hitEnemy = true;
                break;
            }
        }
            if (hitEnemy) continue;
        }
        else if(projectileList[i].Type == projectileData.farm[0]){
            clearLogs();
            log(projectileList[i].x + " " + projectileList[i].y + " " + mouseX + " " + mouseY);
            if(findDist(projectileList[i].x, projectileList[i].y, mouseX, mouseY) <= 250){
                money += projectileList[i].damage;
                projectileList.splice(i,1);
            }
            else{
                drawImg(projectileData.farm[0].image, projectileList[i].x, projectileList[i].y, 62.5, 62.5, 0);
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