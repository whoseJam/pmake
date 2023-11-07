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

    handle = d3.select("body").append("div");
    handle.classed("tool-box", true)
    handle.style("position", "absolute");

    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.show = show;
    self.hide = hide;

    document.ondragstart = function() { 
        return false;
    }

    self.width(300);
    self.height(100);
    replaceToolBox();
    window.addEventListener("resize", replaceToolBox);

    return self;
}

function x(x) {
    if (x ===  undefined)
        return this._.x;
    this._.x = x;
    handle.style("left", (x + offset_x) + "px");
    this.call("onX");
    return this;
}

function y(y) {
    if (y === undefined)
        return this._.y;
    this._.y = y;
    handle.style("top", (y + offset_y) + "px");
    this.call("onY");
    return this;
}

function width(width) {
    if (width === undefined)
        return this._.width;
    this._.width = width;
    handle.style("width", width + "px");
    this.call("onWidth");
    return this;
}

function height(height) {
    if (height === undefined)
        return this._.height;
    this._.height = height;
    handle.style("height", height + "px");
    this.call("onHeight");
    return this;
}

function hide() {
    handle.style("opacity", "0")
    handle.style("pointer-events", "none");
    return this;
}

function show() {
    handle.style("opacity", "1")
    handle.style("pointer-events", "auto");
    return this;
}

function replaceToolBox() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let x = width / 2 - self.width() / 2;
    let y = height - self.height();
    self.x(x);
    self.y(y);
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
    input.attr("type", "color")
    input.classed("tool-item-color-picker", true)
    flexItem(input, 30, 30);
    return input;
}

export function addRange(l, r, step = 1, defaultValue, width) {
    let input = handle.append("input");
    input.attr("type", "range")
    input.attr("min", l)
    input.attr("max", r)
    input.attr("step", step)
    input.attr("value", defaultValue);
    flexItem(input, width, 30);
    return input;
}

export function addIconRadio(name, icons, values, checked = 0, width) {
    let input = handle.append("div");
    input.classed("icon-radio-group", true);
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

export function addColorGroup(colorPicker) {
    let colorGroup = [
        ["#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc"],
        ["#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#99d9ea", "#c8bfe7"]
    ]
    let input = handle.append("div");
    input.style("display", "flex");
    input.style("width", "200px");
    input.style("height", "40px");
    input.style("flex-wrap", "wrap");
    input.classed("tool-item", true);
    for (let i = 0; i < colorGroup.length; i++) {
        for (let j = 0; j < colorGroup[i].length; j++) {
            let div = document.createElement("div");
            div.style.backgroundColor = colorGroup[i][j];
            div.style.width = "20px";
            div.style.height = "20px";
            div.style.border = "1px solid white";
            div.onclick = function() {
                let element = D3Helper.element(colorPicker);
                element.value = colorGroup[i][j];
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    element.dispatchEvent(evt);
                } else element.fireEvent("onchange");
            }
            D3Helper.element(input).appendChild(div);
        }
    }
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