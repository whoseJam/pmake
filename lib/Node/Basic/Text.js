import { Traiter } from "../../Utility/TypeTrait";
import { equal } from "../../Utility/Math";
import { timeout } from "d3";
import { D3Helper } from "../../Utility/D3Helper";
import { Action } from "../../slide";
import { Interp } from "../../Animate/Interp";
import { Base } from "./Base";
import { Color } from "../../Utility/Color";

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
    D3Helper.element(owner).innerHTML = text;
}

export const TextTool = {
    fs2width: fs2height,
    fs2height: fs2height,
    width2fs: width2fs,
    height2fs: height2fs
};

export class Text extends Base {
    constructor(conf, text) {
        super(conf, "text")
        this._.text = parseText(text);
        this._.fontSize = 20;
        this._.fontFamily = "consolas";
        this._.fontWeight = 1;
        this._.d3
            .attr("text-anchor", "start")
            .attr("dy", ".92em")
            .attr("x", this._.x)
            .attr("y", this._.y)
            .attr("font-size", this._.fontSize)
            .attr("font-family", this._.fontFamily)
            .attr("font-weight", this._.fontWeight);
        this._.basic = D3Helper.element(this._.d3);
        this._.snap = Snap(this._.basic);
        
        this.clickable(false);
    
        this.text(text);
        this.fill(Color.black);
        this.strokeOpacity(0);
    
        return this;
    }

    width(width) {
        let ow = this._.width;
        if (width === undefined) return ow;
        if (equal(width, ow)) return this;
        this.fontSize(width2fs(
            this.text(), 
            this.fontFamily(), 
            width));
        return this;
    }

    height(height) {
        let oh = this._.height;
        if (height === undefined) return oh;
        if (equal(height, oh)) return this;
        this.fontSize(height2fs(
            this.text(),
            this.fontFamily(),
            height));
        return this;
    }

    text(text) {
        if (text === undefined)
            return this._.text;
        text = parseText(String(text));
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.text, text,
            Interp.textInterp(this._.d3),
            this, "text"
        );
        this._.text = text;
        this._.width = fs2width(this.text(), this.fontFamily(), this.fontSize());
        this._.height = fs2height(this.text(), this.fontFamily(), this.fontSize());
        this.children.update();
        return this;
    }

    fontSize(fs) {
        let ofs = this._.fontSize;
        if (fs === undefined) return ofs;
        if (equal(fs, ofs)) return this;
        if (!Traiter.isValidNumber(fs)) return this;

        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fontSize, fs,
            Interp.numberInterp(this._.d3, "font-size"),
            this, "font-size"
        );
        this._.fontSize = fs;
        this._.width = fs2width(this.text(), this.fontFamily(), this.fontSize());
        this._.height = fs2height(this.text(), this.fontFamily(), this.fontSize());
        this.children.update();
        return this;
    }

    fontFamily(ff) {
        if (ff === undefined)
            return this._.fontFamily;
        this._.fontFamily = ff;
        setTimeout(function() {
            this._.d3.attr("font-family", ff);
        }, this.delay() + this.duration());
        this._.width = fs2width(this.text(), this.fontFamily(), this.fontSize());
        this._.height = fs2height(this.text(), this.fontFamily(), this.fontSize());
        this.children.update();
        return this;
    }
}

function nw_resize(e) {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let dx = e.dx;
    let dy = e.dx * this.height() / this.width();
    if ((this.width() - dx >= MINW &&
        this.height() - dy >= MINH) || dx < 0)
        this.x(x + dx)
            .y(y + dy)
            .width(width - dx);
}

function ne_resize(e) {
    let y = this.y();
    let width = this.width();
    let dx = e.dx;
    let dy = -e.dx * this.height() / this.width();
    if ((this.width() + dx >= MINW &&
        this.height() - dy >= MINH) || dx > 0)
        this.y(y + dy)
            .width(width + dx);
}

function sw_resize(e) {
    let x = this.x();
    let width = this.width();
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.x(x + e.dx)
            .width(width - e.dx);
}

function fs2width(text, family, fs) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", fs);
    let box = helper.node().getBBox();
    return box.width;
}

function fs2height(text, family, fs) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", fs);
    let box = helper.node().getBBox();
    return box.height;
}

function width2fs(text, family, width) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return width / box.width * 20;
}

function height2fs(text, family, height) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return height / box.height * 20;
}