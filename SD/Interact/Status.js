import { render } from "react-dom";

let frameStatus = undefined;

function ReloadTheWindow() {
    window.location.reload();
}

export function UpdateFrameStatus() {
    let ban = false;
    if (window.IS_CONTINUING) ban = true;
    if (window.IS_INTERACTING) ban = true;
    if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) ban = true;
    frameStatus.style["backgroundColor"] = ban ? "red" : "green";
}

export function initStatus() {
    const element = <div id="wrapper" style={{ position: "fixed", left: "10px", top: "10px", width: "60px", height: "20px", display: "flex", opacity: 0 }}>
        <div style={{ width: "20px", height: "20px" }}>
            <div id="frameStatus" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "green", translate: "5px 5px" }}></div>
        </div>
        <div style={{ width: "20px", height: "20px" }}>
            <i className="sync icon" onClick={ReloadTheWindow}></i>
        </div>
    </div>
    const div = document.createElement("div");
    document.body.append(div);
    render(element, div);
    frameStatus = document.getElementById("frameStatus");

    const wrapper = document.getElementById("wrapper");
    document.addEventListener("keydown", (e) => {
        if (e.key === "t") {
            wrapper.style["opacity"] ^= 1;
        }
    })
}