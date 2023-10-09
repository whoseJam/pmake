import { Listener } from "../Node/Listener";
import { Position } from "../Node/Position";
import { Field } from "../Node/Field";
import { D3Helper } from "../Utility/D3Helper";
import * as d3 from "d3";

let handle = null;
let self = {};        
let offset_x = 8;
let offset_y = 8;

export function toolbox() {
    return self;
}

export function INIT_TOOLBOX(svg) {
    let tool = Toolbox(svg).hide();
    let hide = true;
    document.addEventListener("keydown", (e) => {
        if (!e.ctrlKey && (e.key === "c" || e.key === "C")) {
            if (hide) tool.show();
            else tool.hide();
            hide = !hide;
        }
    });
}

function Toolbox() {
    if (handle) return;

    self = {};
    self = Field(self);
    self = Listener(self);
    self = Position(self);

    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 150);
    self.set("height", 300);

    handle = d3.select("body")
               .append("div")
               .attr("draggable", "true")
               .classed("tool-box", true)
               .style("position", "absolute")
               .style("left", (self.get("x") + offset_x) + "px")
               .style("top", (self.get("y") + offset_y) + "px")
               .style("width", self.get("width") + "px")
               .style("height", self.get("height") + "px")


    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    
    self.show = show;
    self.hide = hide;

    let is_dragging = false;
    document.ondragstart = function() { return false; };

    D3Helper.element(handle).onpointerleave = (e) => {
        // console.log("leave");
    }

    D3Helper.element(handle).onpointerenter = (e) => {
        // console.log("enter");
    }

    D3Helper.element(handle).onpointerdown = (e) => {
        let ox = e.clientX;
        let oy = e.clientY;
        // console.log("mouse down");
        D3Helper.element(handle).onpointermove = (e) => {
            let nx = e.clientX;
            let ny = e.clientY;
            self.dx(nx - ox)
                  .dy(ny - oy);
            ox = nx; oy = ny;
            // console.log("mouse move");
        };
        D3Helper.element(handle).onpointerup = (e) => {
            D3Helper.element(handle).onpointermove = null;
            // console.log("mouse up");
        };
    };

    return self;
}

function x(x) {
    if (typeof(x) ===  "undefined")
        return self.get("x");
    self.set("x", x);
    handle.style("left", (x + offset_x) + "px");
    self.call("onX");
    return self;
}

function y(y) {
    if (typeof(y) === "undefined")
        return self.get("y");
    self.set("y", y);
    handle.style("top", (y + offset_y) + "px");
    self.call("onY");
    return self;
}

function width(width) {
    if (typeof(width) === "undefined")
        return self.get("width");
    self.set("width", width);
    handle.style("width", width + "px");
    self.call("onWidth");
    return self;
}

function height(height) {
    if (typeof(height) === "undefined")
        return self.get("height");
    self.set("height", height);
    handle.style("height", height + "px");
    self.call("onHeight");
    return self;
}

function hide() {
    handle.style("opacity", "0")
          .style("pointer-events", "none");
    return self;
}

function show() {
    handle.style("opacity", "1")
          .style("pointer-events", "auto");
    return self;
}

function flexItem(item, width, height) {
    item.classed("tool-item", true)
        .style("width", width + "px")
        .style("height", height + "px")
    return item;
}

// for system

export function addColorPicker() {
    let input = handle.append("input")
                      .attr("type", "color")
                      .classed("tool-item-color-picker", true)
    flexItem(input, 30, 30);
    return input;
}

export function addRange(l, r, step = 1, width) {
    let input = handle.append("input")
                      .attr("type", "range")
                      .attr("min", l)
                      .attr("max", r)
                      .attr("step", step)
                      .attr("value", l);
    flexItem(input, width, 30);
    return input;
}

export function addIconRadio(name, icons, values, checked = 0, width) {
    let input = handle.append("div")
                      .classed("icon-radio-group", true);
    let html = "";
    for (let i = 0; i < icons.length; i++) {
        let code = `
        <label class="icon-radio-option">
            <input type="radio" name="${name}" 
                   class="icon-radio-input"
                   value="${values[i]}"
                    ${checked === i ? "checked" : ""}>
            <span class="icon-radio-icon">
                ${icons[i]}
            </span>
        </label>`;
        html += code;
    }
    input.html(html);
    flexItem(input, width, 30);
    return input;
}

// for user

function range(name, l, r, step = 1) {
    let input = handle.append("input")
                      .attr("type", "range")
                      .attr("min", l)
                      .attr("max", r)
                      .attr("step", step)
                      .attr("value", l);
    flexItem(input, width, 30);
}