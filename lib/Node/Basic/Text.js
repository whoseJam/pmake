import { Action } from "../../Animate/Action";
import { d3ToNake } from "../../Utility/Tool";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { BasicBase } from "./BasicBase";
import { SDNode } from "../Node";
import { D3Layer } from "../D3Layer";

/**
 * @class Text
 * @description <text>标签的代表类
 */
export class Text extends BasicBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {number|string} text 
     * @returns 
     */
    constructor(node, text) {
        super(node, "text")
        this._.text = text ? parseText(text) : "";
        const nake = this._.nake;
        nake.setAttribute("text-anchor", "start");
        nake.setAttribute("dy", ".92em");
        nake.setAttribute("x", this._.x = 0);
        nake.setAttribute("y", this._.y = 0);
        nake.setAttribute("font-size", this._.fontSize = 20);
        nake.setAttribute("font-family", "consolas");
        nake.setAttribute("fill", this._.fill = "#000000");
        nake.setAttribute("stroke-width", this._.strokeWidth = 0);
        this.text(text);
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this.fontSize(widthToFontSize(this._.text, width));
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck("q");
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this.fontSize(heightToFontSize(this._.text, height));
        return this;
    }

    /**
     * @overload
     * @param {number|string} text 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    text(text) {
        if (text === undefined) return this._.text;
        text = parseText(String(text));
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.text, text,
            Interp.innerHTMLInterp(this._.nake),
            this, "text"
        );
        const box = fontSizeToBox(text, this._.fontSize);
        this._.text = text;
        this._.width = box.width;
        this._.height = box.height;
        this.dirty(this, "R");
        return this;
    }

    /**
     * @overload
     * @param {number} fontSize 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fontSize(fontSize) {
        this.dirtyCheck("q");
        if (fontSize === undefined) return this._.fontSize;
        if (equal(fontSize, this._.fontSize)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fontSize, fontSize,
            Interp.numberInterp(this._.nake, "font-size"),
            this, "font-size"
        );
        const box =  fontSizeToBox(this._.text, fontSize);
        this._.fontSize = fontSize;
        this._.width = box.width;
        this._.height = box.height;
        this.dirty(this, "R");
        return this;
    }
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