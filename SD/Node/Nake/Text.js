import { BaseNake } from "@/Node/Nake/BaseNake";
import { d3ToNake } from "@/Utility/Tool";
import { Interp } from "@/Animate/Interp";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";

export function Text(parent, text = "") {
    BaseNake.call(this, parent, "text");

    this.g().type("Text");

    this.member.set("fill", "#000000");
    this.member.set("stroke-width", 0);
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("text", "");
    this.member.new("font-size", 20);
    this.member.new("width", 0);
    this.member.new("height", 0);

    const nake = this._.nake;
    nake.setAttribute("text-anchor", "start");
    nake.setAttribute("dy", ".92em");
    nake.setAttribute("x", this.member.get("x"));
    nake.setAttribute("y", this.member.get("y"));
    nake.setAttribute("font-size", this.member.get("font-size"));
    nake.setAttribute("font-family", "consolas");
    nake.setAttribute("fill", this.member.get("fill"));
    nake.setAttribute("stroke-width", this.member.get("stroke-width"));

    if (text !== undefined && text !== null) this.text(text);

    return this;
}

Text.prototype = {
    ...BaseNake.prototype
};

Text.prototype.x        = naiveGetterAndSetter("x", "setByEqual");
Text.prototype.y        = naiveGetterAndSetter("y", "setByEqual");
Text.prototype.fontSize = naiveGetterAndSetter("font-size", "setByEqual");
Text.prototype.updateList = [
    ...Text.prototype.updateList,
    naiveUpdate("x", Interp.numberInterp),
    naiveUpdate("y", Interp.numberInterp),
    function() {
        if (this.member.hasChanged("text") || this.member.hasChanged("font-size")) {
            const box = fontSizeToBox(
                this.member.get("text"),
                this.member.get("font-size")
            );
            this.member.set("width", box.width);
            this.member.set("height", box.height);
        }
    },
    naiveUpdate("text", Interp.innerHTMLInterp),
    naiveUpdate("font-size", Interp.numberInterp),
]

Text.prototype.width = function(width) {
    if (width === undefined) {
        return this.member.get("width");
    }
    const fontSize = widthToFontSize(this.member.get("text"), width);
    this.fontSize(fontSize);
    const k = width / this.member.get("width");
    this.member.set("width", k * this.member.get("width"));
    this.member.set("height", k * this.member.get("height"));
    return this;
}

Text.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const fontSize = heightToFontSize(this.member.get("text"), height);
    this.fontSize(fontSize);
    const k = height / this.member.get("height");
    this.member.set("width", k * this.member.get("width"));
    this.member.set("height", k * this.member.get("height"));
    return this;
}

Text.prototype.text = function(text) {
    if (text === undefined) {
        return this.member.get("text");
    }
    text = parseText(String(text));
    this.member.set("text", text);
    this.tryUpdate();
    return this;
}

/**
 * @param {string} text 
 * @returns {string}
 */
function parseText(text) {
    let ans = ""; text = String(text);
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") ans += "\&emsp;";
        else if (text[i] === "<") ans += "\&lt;";
        else if (text[i] === ">") ans += "\&gt;";
        else ans += text[i];
    }
    return ans;
}

let textHelper;
export function initText(svg) {
    textHelper = d3ToNake(svg.append("text"));
    textHelper.setAttribute("stroke-opacity", 0);
    textHelper.setAttribute("fill-opacity", 0);
    textHelper.setAttribute("font-family", "consolas");
}

/**
 * @param {string} text 
 * @param {number} fontSize 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function fontSizeToBox(text, fontSize) {
    textHelper.innerHTML = text;
    textHelper.setAttribute("font-size", fontSize);
    return textHelper.getBBox();
}

/**
 * @param {string} text 
 * @param {number} width 
 * @returns {number}
 */
function widthToFontSize(text, width) {
    textHelper.innerHTML = text;
    textHelper.setAttribute("font-size", 20);
    const box = textHelper.getBBox();
    return width / box.width * 20;
}

/**
 * @param {string} text 
 * @param {number} height 
 * @returns {number}
 */
function heightToFontSize(text, height) {
    textHelper.innerHTML = text;
    textHelper.setAttribute("font-size", 20);
    const box = textHelper.getBBox();
    return height / box.height * 20;
}