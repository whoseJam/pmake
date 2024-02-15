import { Storage } from "../Utility/Storage";
import { D3Helper } from "../Utility/D3Helper";
import { Color } from "../Utility/Color";
import * as d3 from "d3";

let canvas;
let context;
let marquee;
let storage = Storage();

let colorPicker = null;
let lineWidthInput = null;
let canvasToolPicker = null;

let canvasConfigure = {
    clickable: false,
    using: "cursor"       // using: "cursor"/"pen"/"eraser"
};

let penConfigure = {
    lineWidth: 3,
    stroke: Color.black
};

let eraserConfigure = {
    startX: 0, endX: 0, 
    startY: 0, endY: 0
}

function canvasFresh() {
    canvas.style(
        "pointer-events",
        (canvasConfigure.clickable) ? "auto" : "none");
    freshCursor(canvasConfigure.using === "cursor");
    freshPen(canvasConfigure.using === "pen");
    freshEraser(canvasConfigure.using === "eraser");
}

function canvasClickable(flag) {
    canvasConfigure.clickable = flag;
    canvas.style(
        "pointer-events",
        (canvasConfigure.clickable) ? "auto" : "none");
}

function canvasStore() {
    storage.store(
        context.getImageData(
            0, 0,
            D3Helper.element(canvas).width, 
            D3Helper.element(canvas).height));
}

export function appendCanvas() {
    canvas = d3.select("body")
               .insert("canvas", "div")
               .attr("width", 1200)
               .attr("height", 600)
               .style("touch-action", "none")
               .style("position", "absolute")
               .style("left", "0px")
               .style("top", "0px");
    context = D3Helper.element(canvas).getContext("2d");
    marquee = d3.select("body")
                .insert("div", "div");
    D3Helper.element(marquee).style.width = "0px";
    D3Helper.element(marquee).style.height = "0px";
    D3Helper.element(marquee).style.position = "absolute";
    D3Helper.element(marquee).style.border = "1px solid #0976d4";

    document.addEventListener("keydown", clickCtrlZ);
    document.addEventListener("keydown", clickCtrlY);


    colorPicker = document.getElementById("colorPicker");
    lineWidthInput = document.getElementById("lineWidthInput");
    colorPicker.addEventListener("change", () => {
        penConfigure.stroke = colorPicker.value;
        context.strokeStyle = penConfigure.stroke; });
    lineWidthInput.addEventListener("change", () => {
        penConfigure.lineWidth = lineWidthInput.value;
        context.lineWidth = penConfigure.lineWidth; });
 
    canvasToolPicker = document.getElementById("canvasToolPicker");
    canvasToolPicker.addEventListener("change", (e) => {
        let radio = document.getElementsByName("canvas-tool");
        for (let i = 0; i < radio.length; i++)
            if (radio[i].checked)
                canvasConfigure.using = radio[i].value;
        canvasFresh();
    })
    
    canvasFresh();
    canvasStore();
}

function clickCtrlZ(e) {
    if(e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        storage.lastVersion((data) => {
            context.putImageData(data, 0, 0);
        });
    }
}

function clickCtrlY(e) {
    if(e.ctrlKey && (e.key === "y" || e.key === "Y")){
        storage.nextVersion((data) => {
            context.putImageData(data, 0, 0);
        });
    }
}

function freshCursor(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = null;
        D3Helper.element(canvas).onpointermove = null;
        D3Helper.element(canvas).onpointerup = null;
        canvasClickable(false);
    }
}

function freshPen(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = PENPointerDown;
        D3Helper.element(canvas).onpointerup = PENPointerUp;
        D3Helper.element(canvas).onpointermove = null;
        canvasClickable(true);
    }
}

function freshEraser(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = ERASERPointerDown;
        D3Helper.element(canvas).onpointerup = ERASERPointerUp;
        D3Helper.element(canvas).onpointermove = null;
        canvasClickable(true);
    }
}

function PENPointerDown(e) {
    context.strokeStyle = penConfigure.stroke;
    context.lineWidth = penConfigure.lineWidth;
    let left = e.offsetX;
    let top = e.offsetY;
    context.beginPath();
    context.moveTo(left, top);
    D3Helper.element(canvas).onpointermove = PENPointerMove;
}

function PENPointerMove(e) {
    if (e.pointerType)
        context.lineWidth = penConfigure.lineWidth * (0.5 + e.pressure);
    let left = e.offsetX;
    let top = e.offsetY;
    context.lineTo(left, top);
    context.stroke();
}

function PENPointerUp() {
    canvasStore();
    D3Helper.element(canvas).onpointermove = null;
}

function ERASERPointerDown(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraserConfigure.startX = left;
    eraserConfigure.startY = top;
    D3Helper.element(canvas).onpointermove = ERASERPointerMove;
}

let O = 5;
function ERASERPointerMove(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraserConfigure.endX = left;
    eraserConfigure.endY = top;
    let min_x = Math.min(eraserConfigure.startX, eraserConfigure.endX) + O;
    let min_y = Math.min(eraserConfigure.startY, eraserConfigure.endY) + O;
    let max_x = Math.max(eraserConfigure.startX, eraserConfigure.endX) - O;
    let max_y = Math.max(eraserConfigure.startY, eraserConfigure.endY) - O;
    D3Helper.element(marquee).style.top = min_y + "px"
    D3Helper.element(marquee).style.left = min_x + "px"
    D3Helper.element(marquee).style.width = (max_x - min_x) + "px"
    D3Helper.element(marquee).style.height = (max_y - min_y) + "px"
}

function ERASERPointerUp(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraserConfigure.endX = left;
    eraserConfigure.endY = top;
    let min_x = Math.min(eraserConfigure.startX, eraserConfigure.endX) + O;
    let min_y = Math.min(eraserConfigure.startY, eraserConfigure.endY) + O;
    let max_x = Math.max(eraserConfigure.startX, eraserConfigure.endX) - O;
    let max_y = Math.max(eraserConfigure.startY, eraserConfigure.endY) - O;
    context.clearRect(min_x, min_y, max_x - min_x, max_y - min_y);
    canvasStore();
    D3Helper.element(canvas).onpointermove = null;
    D3Helper.element(marquee).style.width = "0px";
    D3Helper.element(marquee).style.height = "0px";
}