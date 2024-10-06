import { Interp } from "@/Animate/Interp";

import { Dom } from "@/Dom/Dom";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export function Text(parent, text = "") {
    BaseNake.call(this, parent, "text");

    this.type("Text");

    this.member.setAndFlush("fill", "#000000");
    this.member.setAndFlush("stroke-width", 0);
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

Text.prototype = {
    ...BaseNake.prototype
};

Text.prototype.x        = SDNode.OrdinaryGSet("x", "setByEqual");
Text.prototype.y        = SDNode.OrdinaryGSet("y", "setByEqual");
Text.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual");
Text.prototype.updateList = [
    ...Text.prototype.updateList,
    SDNode.OrdinaryUpdate("x", Interp.numberInterp),
    SDNode.OrdinaryUpdate("y", Interp.numberInterp),
    function() {
        if (this.member.hasChanged("text") || this.member.hasChanged("font-size")) {
            const box = Text.fontSizeToBox(
                this.member.get("text"),
                this.member.get("font-size")
            );
            this.member.set("width", box.width);
            this.member.set("height", box.height);
        }
    },
    SDNode.OrdinaryUpdate("text", Interp.innerHTMLInterp),
    SDNode.OrdinaryUpdate("font-size", Interp.numberInterp),
]

Text.prototype.width = function(width) {
    if (width === undefined) {
        return this.member.get("width");
    }
    const fontSize = Text.widthToFontSize(this.member.get("text"), width);
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
    const fontSize = Text.heightToFontSize(this.member.get("text"), height);
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
    text = Text.parseText(String(text));
    this.member.set("text", text);
    this.tryUpdate();
    return this;
}

Text.prototype.intValue = function() {
    return +this.text();
}

Text.parseText = function(text) {
    let ans = ""; text = String(text);
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") ans += "\&emsp;";
        else if (text[i] === "<") ans += "\&lt;";
        else if (text[i] === ">") ans += "\&gt;";
        else ans += text[i];
    }
    return ans;
}

Text.init = function() {
    Text.helper = Dom.createSVGElement("text");
    Dom.getByID("1").append(Text.helper);
    Text.helper.setAttribute("stroke-opacity", 0);
    Text.helper.setAttribute("fill-opacity", 0);
    Text.helper.setAttribute("font-family", "consolas");
}

Text.fontSizeToBox = function(text, fontSize) {
    Text.helper.innerHTML = text;
    Text.helper.setAttribute("font-size", fontSize);
    return Text.helper.getBBox();
}

Text.widthToFontSize = function(text, width) {
    Text.helper.innerHTML = text;
    Text.helper.setAttribute("font-size", 20);
    const box = Text.helper.getBBox();
    return width / box.width * 20;
}

Text.heightToFontSize = function(text, height) {
    Text.helper.innerHTML = text;
    Text.helper.setAttribute("font-size", 20);
    const box = Text.helper.getBBox();
    return height / box.height * 20;
}