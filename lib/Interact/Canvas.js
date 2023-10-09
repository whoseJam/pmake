import { Storage } from "../Utility/Storage";
import { D3Helper } from "../Utility/D3Helper";
import { Color } from "../Utility/Color";
import * as tool from "./Toolbox";
import * as d3 from "d3";

let canvas;
let context;
let marquee;
let storage = Storage();

let color_picker = null;
let line_width_input = null;
let canvas_tool_picker = null;

let canvas_configure = {
    clickable: false,
    using: "cursor"       // using: "cursor"/"pen"/"eraser"
};

let pen_configure = {
    line_width: 1,
    stroke: Color.black
};

let eraser_configure = {
    start_x: 0, end_x: 0, 
    start_y: 0, end_y: 0
}

function canvas_fresh() {
    canvas.style(
        "pointer-events",
        (canvas_configure.clickable) ? "auto" : "none");
    fresh_cursor(canvas_configure.using === "cursor");
    fresh_pen(canvas_configure.using === "pen");
    fresh_eraser(canvas_configure.using === "eraser");
}

function canvas_clickable(flag) {
    canvas_configure.clickable = flag;
    canvas.style(
        "pointer-events",
        (canvas_configure.clickable) ? "auto" : "none");
}

function canvas_store() {
    storage.store(
        context.getImageData(
            0, 0,
            D3Helper.element(canvas).width, 
            D3Helper.element(canvas).height));
}

export function append_canvas() {
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

    document.addEventListener("keydown", click_ctrlZ);
    document.addEventListener("keydown", click_ctrlY);
    color_picker = tool.add_color_picker();
    line_width_input = tool.add_range(1, 10, 1, 120);
    D3Helper.element(color_picker).addEventListener("change", () => {
        pen_configure.stroke = D3Helper.element(color_picker).value;
        context.strokeStyle = pen_configure.stroke; });
    D3Helper.element(line_width_input).addEventListener("change", () => {
        pen_configure.line_width = D3Helper.element(line_width_input).value;
        context.lineWidth = pen_configure.line_width; });
    let cursor = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mouse-pointer"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>`;
    let pen = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
    let eraser = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.48 3 7.73 7.75 3 12.59a2 2 0 0 0 0 2.82l4.3 4.3A1 1 0 0 0 8 20h12v-2h-7l7.22-7.22a2 2 0 0 0 0-2.83L15.31 3a2 2 0 0 0-2.83 0zM8.41 18l-4-4 4.75-4.84.74-.75 4.95 4.95-4.56 4.56-.07.08z"/></svg>`

    canvas_tool_picker = tool.add_icon_radio(
        "canvas-tool", 
        [cursor, pen, eraser],
        ["cursor", "pen", "eraser"], 0, 120)
    
    D3Helper.element(canvas_tool_picker).addEventListener("change", (e) => {
        let radio = document.getElementsByName("canvas-tool");
        for (let i = 0; i < radio.length; i++)
            if (radio[i].checked)
                canvas_configure.using = radio[i].value;
        canvas_fresh();
    })
    
    canvas_fresh();
    canvas_store();
}

function click_ctrlZ(e) {
    if(e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        storage.lastVersion((data) => {
            context.putImageData(data, 0, 0);
        });
    }
}

function click_ctrlY(e) {
    if(e.ctrlKey && (e.key === "y" || e.key === "Y")){
        storage.nextVersion((data) => {
            context.putImageData(data, 0, 0);
        });
    }
}

function fresh_cursor(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = null;
        D3Helper.element(canvas).onpointermove = null;
        D3Helper.element(canvas).onpointerup = null;
        canvas_clickable(false);
    }
}

function fresh_pen(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = PEN_pointer_down;
        D3Helper.element(canvas).onpointerup = PEN_pointer_up;
        D3Helper.element(canvas).onpointermove = null;
        canvas_clickable(true);
    }
}

function fresh_eraser(flag) {
    if (flag) {
        D3Helper.element(canvas).onpointerdown = ERASER_pointer_down;
        D3Helper.element(canvas).onpointerup = ERASER_pointer_up;
        D3Helper.element(canvas).onpointermove = null;
        canvas_clickable(true);
    }
}

function PEN_pointer_down(e) {
    context.strokeStyle = pen_configure.stroke;
    context.lineWidth = pen_configure.line_width;
    let left = e.offsetX;
    let top = e.offsetY;
    context.beginPath();
    context.moveTo(left, top);
    D3Helper.element(canvas).onpointermove = PEN_pointer_move;
}

function PEN_pointer_move(e) {
    if (e.pointerType)
        context.lineWidth = pen_configure.line_width * (0.5 + e.pressure);
    let left = e.offsetX;
    let top = e.offsetY;
    context.lineTo(left, top);
    context.stroke();
}

function PEN_pointer_up() {
    canvas_store();
    D3Helper.element(canvas).onpointermove = null;
}

function ERASER_pointer_down(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraser_configure.start_x = left;
    eraser_configure.start_y = top;
    D3Helper.element(canvas).onpointermove = ERASER_pointer_move;
}

let O = 5;
function ERASER_pointer_move(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraser_configure.end_x = left;
    eraser_configure.end_y = top;
    let min_x = Math.min(eraser_configure.start_x, eraser_configure.end_x) + O;
    let min_y = Math.min(eraser_configure.start_y, eraser_configure.end_y) + O;
    let max_x = Math.max(eraser_configure.start_x, eraser_configure.end_x) - O;
    let max_y = Math.max(eraser_configure.start_y, eraser_configure.end_y) - O;
    D3Helper.element(marquee).style.top = min_y + "px"
    D3Helper.element(marquee).style.left = min_x + "px"
    D3Helper.element(marquee).style.width = (max_x - min_x) + "px"
    D3Helper.element(marquee).style.height = (max_y - min_y) + "px"
}

function ERASER_pointer_up(e) {
    let left = e.offsetX;
    let top = e.offsetY;
    eraser_configure.end_x = left;
    eraser_configure.end_y = top;
    let min_x = Math.min(eraser_configure.start_x, eraser_configure.end_x) + O;
    let min_y = Math.min(eraser_configure.start_y, eraser_configure.end_y) + O;
    let max_x = Math.max(eraser_configure.start_x, eraser_configure.end_x) - O;
    let max_y = Math.max(eraser_configure.start_y, eraser_configure.end_y) - O;
    context.clearRect(min_x, min_y, max_x - min_x, max_y - min_y);
    canvas_store();
    D3Helper.element(canvas).onpointermove = null;
    D3Helper.element(marquee).style.width = "0px";
    D3Helper.element(marquee).style.height = "0px";
}