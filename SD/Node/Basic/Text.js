import { Action } from "@/Animate/Action";
import { BaseNake } from "@/Node/Basic/BaseNake";
import { D3Layer } from "@/Node/D3Layer";
import { d3ToNake } from "@/Utility/Tool";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/Node";

/**
 * @class Text
 * @description <text>标签的代表类
 */
export class Text extends BaseNake {
    /**
     * @constructor
     * @param {SDNode|D3Layer} parent 
     * @param {number|string|undefined} text 
     * @returns 
     */
    constructor(parent, text) {
        super(parent, "text")

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
    }

    x(x) {
        if (x === undefined) {
            return this.member.get("x");
        }
        this.member.setByEqual("x", x);
        this.tryUpdate();
        return this;
    }

    y(y) {
        if (y === undefined) {
            return this.member.get("y");
        }
        this.member.setByEqual("y", y);
        this.tryUpdate();
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
        if (width === undefined) {
            return this.member.get("width");
        }
        const fontSize = widthToFontSize(this.member.get("text"), width);
        this.fontsize(fontSize);
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
        if (height === undefined) {
            return this.member.get("height");
        }
        const fontSize = heightToFontSize(this.member.get("text"), height);
        this.fontSize(fontSize);
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
        if (text === undefined) {
            return this.member.get("text");
        }
        text = parseText(String(text));
        console.log("text=", text);
        this.member.set("text", text);
        console.log("text has changed=", this.member.hasChanged("text"), "last=", this.member.oldValue("text"), "new=", this.member.get("text"));
        this.tryUpdate();
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
        if (fontSize === undefined) {
            return this.member.get("font-size");
        }
        this.member.setByEqual("font-size", fontSize);        
        this.tryUpdate();
        return this;
    }

    update() {
        this.preUpdate();
        if (this.member.hasChanged("x")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("x"),
                this.member.get("x"),
                Interp.numberInterp(this._.nake, "x"),
                this, "x"
            );
            this.member.flush("x");
        }
        if (this.member.hasChanged("y")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("y"),
                this.member.get("y"),
                Interp.numberInterp(this._.nake, "y"),
                this, "y"
            );
            this.member.flush("y");
        }
        if (this.member.hasChanged("text") || this.member.hasChanged("font-size")) {
            const box = fontSizeToBox(
                this.member.get("text"),
                this.member.get("font-size")
            );
            this.member.set("width", box.width);
            this.member.set("height", box.height);
        }
        if (this.member.hasChanged("text")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("text"),
                this.member.get("text"),
                Interp.innerHTMLInterp(this._.nake),
                this, "text"
            );
            this.member.flush("text");  
        }
        if (this.member.hasChanged("font-size")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("font-size"),
                this.member.get("font-size"),
                Interp.numberInterp(this._.nake, "font-size"),
                this, "font-size"
            );
            this.member.flush("font-size");
        }
        this.postUpdate();
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