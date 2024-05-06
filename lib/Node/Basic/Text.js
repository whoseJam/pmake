import { Action } from "../../Animate/Action";
import { Base } from "./Base";
import { Color } from "../../Utility/Color";
import { d3ToNake } from "../../Utility/Tool";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";

let helper;

export function INIT_TEXT(svg) {
    helper = svg.append("text")
        .attr("stroke-opacity", 0)
        .attr("fill-opacity", 0);
}

function parseText(txt) {
    let ans = ""; txt = String(txt);
    for (let i = 0; i < txt.length; i++) {
        if (txt[i] === " ") ans += "\&emsp;";
        else if (txt[i] === "<") ans += "\&lt;";
        else if (txt[i] === ">") ans += "\&gt;";
        else ans += txt[i];
    }
    return ans;
}

/**
 * 设置owner的文本为text
 * @param {D3Node} owner 
 * @param {string} text
 */
function setText(owner, text) {
    d3ToNake(owner).innerHTML = text;
}

export class Text extends Base {
    constructor(node, text) {
        super(node, "text")
        this._.text = text ? parseText(text) : "";
        this._.fontSize = 20;
        this._.d3
            .attr("text-anchor", "start")
            .attr("dy", ".92em")
            .attr("x", this._.x)
            .attr("y", this._.y)
            .attr("font-size", this._.fontSize)
            .attr("font-family", "consolas")
        this._.nake = d3ToNake(this._.d3);
        this._.snap = Snap(this._.nake);
        
        this.clickable(false);
        this.text(text);
        this.fill(Color.black);
        this.strokeOpacity(0);
    
        return this;
    }

    x(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x, x,
            Interp.numberInterp(this._.d3, "x"),
            this, "x"
        );
        this._.x = x;
        this.dirty();
        return this;
    }

    y(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y, y,
            Interp.numberInterp(this._.d3, "y"),
            this, "y"
        );
        this._.y = y;
        this.dirty();
        return this;
    }

    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this.fontSize(widthToFontSize(this._.text, width));
        return this;
    }

    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this.fontSize(heightToFontSize(this._.text, height));
        return this;
    }

    text(text) {
        if (text === undefined) return this._.text;
        text = parseText(String(text));
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.text, text,
            Interp.textInterp(this._.d3),
            this, "text"
        );
        let box = fontSizeToBox(text, this._.fontSize);
        this._.text = text;
        this._.width = box.width;
        this._.height = box.height;
        return this;
    }

    fontSize(fontSize) {
        this.dirtyCheck();
        if (fontSize === undefined) return this._.fontSize;
        if (equal(fontSize, this._.fontSize)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fontSize, fontSize,
            Interp.numberInterp(this._.d3, "font-size"),
            this, "font-size"
        );
        let box =  fontSizeToBox(this._.text, fontSize);
        this._.fontSize = fontSize;
        this._.width = box.width;
        this._.height = box.height;
        this.dirty();
        return this;
    }
}

function fontSizeToBox(text, fontSize) {
    setText(helper, text);
    helper.attr("font-family", "consolas");
    helper.attr("font-size", fontSize);
    return helper.node().getBBox();
}

function widthToFontSize(text, width) {
    setText(helper, text);
    helper.attr("font-family", "consolas");
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return width / box.width * 20;
}

function heightToFontSize(text, height) {
    setText(helper, text);
    helper.attr("font-family", "consolas");
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return height / box.height * 20;
}