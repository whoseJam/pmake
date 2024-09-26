
const frameStatus = document.getElementById("frameStatus");

export function updateFrameStatus() {
    let ban = false;
    if (window.IS_CONTINUING) ban = true;
    if (window.IS_INTERACTING) ban = true;
    if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) ban = true;
    frameStatus.style["backgroundColor"] = ban ? "red" : "green";
}