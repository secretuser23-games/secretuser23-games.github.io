var money = 0, perSecond = 1, boughtUpgrades = [[false]];
function log(logText){
    var newP = document.createElement("p");
    newP.innerHTML = "Log: " + logText;
    gebid("log").appendChild(newP);
}
function warn(logText){
    var newP = document.createElement("p");
    newP.innerHTML = "Warning: " + logText;
    newP.style = "background-color:yellow;color:orange";
    gebid("log").appendChild(newP);
}
function error(logText){
    var newP = document.createElement("p");
    newP.innerHTML = "Error: " + logText;
    newP.style = "background-color:red;color:maroon";
    gebid("log").appendChild(newP);
}
function gebid(input){
    return document.getElementById(input);
}
function breakLargeNumbers(input){
    exponent = Math.floor(Math.log10(input));
    mantissa = input / Math.pow(10, exponent);
    return [mantissa, exponent];
}
function addWithLargeNumbers(input1, input2){
    var larger = input1[1]>= input2[1] ? input1 : input2;
    var smaller = input1[1] >= input2[1] ? input2 : input1;
    var expDiff = larger[1] - smaller[1];
    var shiftedSmallerMantissa = smaller[0] * Math.pow(10, -expDiff);
    var outMantissa = larger[0] + shiftedSmallerMantissa;
    var outExponent = larger[1];
    if(outMantissa >= 10){
        outMantissa = outMantissa / 10;
        outExponent += 1;
    }
    return [outMantissa, outExponent];
}
function multWithLargeNumbers(input1, input2){
    mantissa = input1[0] * input2[0];
    exponent = input1[1] + input2[1];
    return [mantissa, exponent];
}
document.addEventListener("keydown", function(event){
    if(event.code = "D"){
        if(gebid("log").classList == "logShow"){
            gebid("log").classList = "logHide"
        } else {
            gebid("log").classList = "logShow"
        }
    }
})
function attemptBuyTreeUpgrade(type, upgrade){
    if(type == "normal" && upgrade == "R1C1" && !boughtUpgrades[0][0]){
        perSecond = 1;
        boughtUpgrades[0][0] = true;
    }
}
log("Logging started.");
log("Test of addition: (100+123) " + addWithLargeNumbers(breakLargeNumbers(100), breakLargeNumbers(123))[0] + "e" + addWithLargeNumbers(breakLargeNumbers(100), breakLargeNumbers(123))[1]);
log("Test of multiplication (10*11.25)" + multWithLargeNumbers(breakLargeNumbers(10), breakLargeNumbers(11.25))[0] + "e" + multWithLargeNumbers(breakLargeNumbers(10), breakLargeNumbers(11.25))[1]);