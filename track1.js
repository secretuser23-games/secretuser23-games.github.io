//Order is L, then R, then U, then D.  Any modifiers(entrance/exit/etc) comes afterward.
var roadLD = initImage("RoadLD.png")
var roadLR = initImage("RoadLR.jpg")
var roadUD = initImage("RoadUD.jpg")
var roadLU = initImage("RoadLU.png")
var roadLRD = initImage("RoadLRD.png")
var roadLRU = initImage("RoadLRU.png")
var roadLRUD = initImage("RoadLRUD.png")
var roadLU = initImage("RoadLU.png")
var roadLUD = initImage("RoadLUD.png")
var roadRD = initImage("RoadRD.png");
var roadRU = initImage("RoadRU.png")
var roadRUD = initImage("RoadRUD.png")
var grass = initImage("grass.png")
var grassRock = initImage("grassRock.png")
var water = initImage("water/Water.png")
var deepWater = initImage("water/deepWater.png")
var veryDeepWater = initImage("water/veryDeepWater.png")
var entranceIndicator = initImage("EntranceIndicator.png")
var entrance = {x: 0, y: 0}
var trackInfo = [
//Row 1
[{"track":true, "x":0, "y":0, "tower":false, "isImportantTrack":true, "typeTrack":roadLR, inportantTrackDetails: "EntranceIndicator"}, 
{"track":true, "x":1, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR},
{"track":true, "x":2, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":3, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":4, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":5, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":6, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":7, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":8, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":9, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":10, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":11, "y":0, "tower":false,"isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":12, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":13, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":14, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLR}, 
{"track":true, "x":15, "y":0, "tower":false, "isImportantTrack":false, "typeTrack":roadLD}],
//Row 2
[{"track": false, "x": 0, "y":1, "tower":false, canPlaceTower:true, "typeTrack": grass}, 
{"track": false, "x": 1, "y":1, "tower":false, canPlaceTower:true, "typeTrack": grass},
{"track": false, "x": 2, "y":1, "tower":false, canPlaceTower:true, "typeTrack": grass},
{"track": false, "x": 3, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 4, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 5, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 6, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 7, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 8, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},  
{"track": false, "x": 9, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 10, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 11, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track": false, "x": 12, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass}, 
{"track": false, "x": 13, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass}, 
{"track": false, "x": 14, "y":1, "tower":false, canPlaceTower:true, typeTrack: grass},
{"track":true, "x":15, "y":1, "tower":false, "isImportantTrack":false, typeTrack:roadUD}],
//Row 3
[{"track": true, "x": 0, "y": 2, "tower": false, typeTrack: roadRD},
{"track": true, "x": 1, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 2, "y": 2, "tower": false, typeTrack: roadLR}, {"track": true, "x": 3, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 4, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 5, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 6, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 7, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 8, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 9, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 10, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 11, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 12, "y": 2, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 13, "y": 2, "tower": false, typeTrack: roadLD}, 
{"track": true, "x": 14, "y": 2, "tower": false, typeTrack: grass}, 
{"track": true, "x": 15, "y": 2, "tower": false, typeTrack:roadUD}],
//Row 4
[{"track": true, "x": 0, "y": 3, "tower": false, typeTrack: roadUD},
{"track": false, "x": 1, "y": 3, "tower": false, typeTrack: grassRock}, 
{"track": true, "x": 2, "y": 3, "tower": false, typeTrack: grass}, {"track": "water", "x": 3, "y": 3, "tower": false, typeTrack: water}, 
{"track": true, "x": 4, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 5, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 6, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 7, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 8, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 9, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 10, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 11, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 12, "y": 3, "tower": false, typeTrack: roadLR}, 
{"track": true, "x": 13, "y": 3, "tower": false, typeTrack: roadLD}, 
{"track": true, "x": 14, "y": 3, "tower": false, typeTrack: grass}, 
{"track": true, "x": 15, "y": 3, "tower": false, typeTrack:roadUD}]


];