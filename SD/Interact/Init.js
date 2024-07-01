import { initSvg } from "../Interact/Svg";
import { appendCanvas } from "../Interact/Canvas";
import { initText } from "../Node/Basic/Text";
// import { initPath } from "../Node/Basic/Path";
// import { initFragment } from "../Node/Basic/Fragment";
import { initMessage } from "./Message";

export function init() {
    initToolbox();
    initTerminal();
    initAdjust();
    const svg = initSvg();
    initText(svg);
    // initPath(svg);
    // initFragment(svg);
    appendCanvas()
    initMessage();
}

function initToolbox() {
if (window.self !== window.top) return;
const tempElement = document.createElement("div");
tempElement.innerHTML = ToolboxCode;
document.body.appendChild(tempElement);
const toolboxElement = document.getElementById("toolbox");
const rgbToString = (str) => {
    let result = ''
    if (str.indexOf("#") === 0) {
        result = str
    } else if (str.indexOf("rgb(") === 0) {
        const colors = str.replace(/rgb\(/g, "").replace(/\)/g, "").split(",")
        const r = parseInt(colors[0]).toString(16).length === 1 ? "0" + parseInt(colors[0]).toString(16) : parseInt(colors[0]).toString(16)
        const g = parseInt(colors[1]).toString(16).length === 1 ? "0" + parseInt(colors[1]).toString(16) : parseInt(colors[1]).toString(16)
        const b = parseInt(colors[2]).toString(16).length === 1 ? "0" + parseInt(colors[2]).toString(16) : parseInt(colors[2]).toString(16)
        result = `#${r}${g}${b}`
    }
    return result
}
const hideToolbox = () => {
    toolboxElement.style.opacity = 0;
    toolboxElement.style["pointer-events"] = "none";
}
const showToolbox = () => {
    toolboxElement.style.opacity = 1;
    toolboxElement.style["pointer-events"] = "auto";
}
hideToolbox();
let toolboxHidden = true;
document.ondragstart = () => false;
document.addEventListener("keydown", (e) => {
    if (window.__PREVENTKEYBOARD__) return;
    if (!e.ctrlKey && (e.key === "c" || e.key === "C")) {
        if (toolboxHidden) showToolbox(); else hideToolbox();
        toolboxHidden = !toolboxHidden;
    }
});
const colors = document.getElementById("colors");
const colorPicker = document.getElementById("colorPicker");
for (let child of colors.children) {
    child.onclick = function() {
        let color = child.style["background-color"];
        color = rgbToString(color);
        colorPicker.value = color;
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            colorPicker.dispatchEvent(evt);
        } else colorPicker.fireEvent("onchange");
    }
}
}

function initTerminal() {
if (window.self !== window.top) return;
const tempElement = document.createElement("div");
tempElement.innerHTML = TerminalCode;
document.body.appendChild(tempElement);
const terminalElement = document.getElementById("terminal");
const outputElement = document.getElementById("output");
const inputElement = document.getElementById("input");
let terminalHidden = true;
const hideTerminal = () => {
    terminalElement.style.opacity = 0;
    terminalElement.style["pointer-events"] = "none";
}
const showTerminal = () => {
    terminalElement.style.opacity = 1;
    terminalElement.style["pointer-events"] = "auto";
}
hideTerminal();
document.addEventListener("keydown", (e) => {
    if (window.__PREVENTKEYBOARD__) return;
    if (!e.ctrlKey && (e.key === "t" || e.key === "T")) {
        if (terminalHidden) showTerminal(); else hideTerminal();
        terminalHidden = !terminalHidden;
    }
});
const stringifyObject = (obj) => {
    let result = "{";
    const keys = Object.keys(obj);
    if (keys.length >= 1) result = result + "<br>";
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        if (key === "children" || key === "_" || key === "isDirty" || key === "parent") continue;
        if (typeof(value) === "object") result += "    " + key + ": object,<br>";
        else if (typeof(value) === "function") result += "    " + key + ": function,<br>";
        else result += "    " + key + ": " + value + ",<br>";
    }
    result += "}";
    return result;
}
const processCommand = (command) => {
    try {
        const result = eval(command);
        outputElement.innerHTML = `<pre>command: ${command}<pre>`;
        if (typeof(result) === "object") result = stringifyObject(result)
        outputElement.innerHTML += `<pre class="result">result: ${result}<pre>`;
    } catch(e) {
        outputElement.innerHTML = `<pre>command: ${command}<pre>`;
        outputElement.innerHTML += `<pre class="error">error: ${e}<pre>`;
    }
}
inputElement.addEventListener("focus", () => {
    window.__PREVENTKEYBOARD__ = true;
});
inputElement.addEventListener("blur", () => {
    window.__PREVENTKEYBOARD__ = false;
})
inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = inputElement.value;
        processCommand(command);
        inputElement.value = "";
        outputElement.scrollTop = output.scrollHeight;
    }
})

}

function initAdjust() {
    function resizeAll() {
        {   let width = window.innerWidth;
            let height = window.innerHeight;
            let x = width / 2 - toolbox.style.width / 2;
            let y = height - toolbox.style.height;
            toolbox.style.left = (x + 8) + "px";
            toolbox.style.top = (y + 8) + "px";
        }
        {   let width = window.innerWidth;
            let height = window.innerHeight;
            let x = width / 2 - terminal.style.width / 2;
            let y = height - terminal.style.height;
            terminal.style.left = x + "px";
            terminal.style.top = y + "px";
        }
    }
    document.addEventListener("keydown", function(e) {
        if (window.__PREVENTKEYBOARD__) return;
        if (e.key === "n" || e.key === "N") window.next();
        if (e.key === "p" || e.key === "P") window.prev();
    })
}

const ToolboxCode = `
<div id="toolbox" class="tool-box" style="position: absolute; width: 300px; height: 100px; left: 474px; top: 580px; opacity: 1; pointer-events: auto;">
    <input id="colorPicker" type="color" class="tool-item-color-picker tool-item" style="width: 30px; height: 30px;">
    <input id="lineWidthInput" type="range" min="1" max="10" step="1" value="3" class="tool-item" style="width: 120px; height: 30px;">
    <div id="canvasToolPicker" class="icon-radio-group tool-item" style="width: 120px; height: 30px;">
        <label class="icon-radio-option">
            <input type="radio" name="canvas-tool" class="icon-radio-input" value="cursor" checked="">
            <span class="icon-radio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mouse-pointer"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>
            </span>
        </label>
        <label class="icon-radio-option">
            <input type="radio" name="canvas-tool" class="icon-radio-input" value="pen">
            <span class="icon-radio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </span>
        </label>
        <label class="icon-radio-option">
            <input type="radio" name="canvas-tool" class="icon-radio-input" value="eraser">
            <span class="icon-radio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.48 3 7.73 7.75 3 12.59a2 2 0 0 0 0 2.82l4.3 4.3A1 1 0 0 0 8 20h12v-2h-7l7.22-7.22a2 2 0 0 0 0-2.83L15.31 3a2 2 0 0 0-2.83 0zM8.41 18l-4-4 4.75-4.84.74-.75 4.95 4.95-4.56 4.56-.07.08z"></path></svg>
            </span>
        </label>
    </div>
    <div id="colors" class="tool-item" style="display: flex; width: 200px; height: 40px; flex-wrap: wrap;">
        <div style="background-color: rgb(0, 0, 0); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(127, 127, 127); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(136, 0, 21); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(237, 28, 36); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(255, 127, 39); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(255, 242, 0); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(34, 177, 76); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(0, 162, 232); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(63, 72, 204); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(255, 255, 255); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(195, 195, 195); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(185, 122, 87); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(255, 174, 201); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(255, 201, 14); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(239, 228, 176); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(181, 230, 29); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(153, 217, 234); width: 20px; height: 20px; border: 1px solid white;"></div>
        <div style="background-color: rgb(200, 191, 231); width: 20px; height: 20px; border: 1px solid white;"></div>
    </div>
</div>`;

const TerminalCode = `
<div id="terminal" style="position: absolute; top: 540px; opacity: 0.5;">
    <div id="input-line">
        <span id="prompt">></span>
        <input id="input" type="text" />
    </div>
    <div id="output" style="height: 80%; overflow-y: auto;"></div>
</div>`;