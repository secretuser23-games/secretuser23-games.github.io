function getCookieJsonValue(storageKey, jsonKey) {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) return null;

    try {
        const jsonObject = JSON.parse(rawValue);
        return jsonObject[jsonKey] !== undefined ? jsonObject[jsonKey] : null;
    } catch (e) {
        console.error("Malformed JSON in local storage:", e);
        createCookie(); 
        return null;
    }
}
if(getCookieJsonValue("main", "OSesUnlocked") == null || getCookieJsonValue("main", "OSesUnlocked")[1] == false){
    document.location = "95.html"
}
function attemptOpenOS(OSID){
    if(OSID == 98){
        if(getCookieJsonValue("main", "OSesUnlocked")[1] == true){
            document.location = "98.html"
        }
        else{
            alert("You have not unlocked this yet!")
        }
    }
}