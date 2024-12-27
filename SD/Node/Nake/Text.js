import { Interp } from "@/Animate/Interp";

import { Dom } from "@/Dom/Dom";

import { BaseNake } from "@/Node/Nake/BaseNake";

import { effect }         from "@/Node/SDNode/SDValue";
import { reactive }       from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

import { Color as C } from "@/Utility/Color";

export function Text(parent, text = "") {
    BaseNake.call(this, parent, "text");

    this.type("Text");

    this.vars.fill = C.black;
    this.vars.strokeWidth = 0;
    this.vars.merge(reactive({
        x: 0,
        y: 0,
        text: "",
        fontSize: 20,
        width: 0,
        height: 0
    }));

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    effect(() => {
        const box = Text.fontSizeToBox(
            this.vars.text,
            this.vars.fontSize
        );
        this.vars.width = box.width;
        this.vars.height = box.height;
    });
    this.vars.associate("text", Factory.action(this, this._.nake, "innerHTML", Interp.innerHTMLInterp));
    this.vars.associate("fontSize", Factory.action(this, this._.nake, "font-size", Interp.numberInterp));
    
    this._.nake.setAttribute("text-anchor", "start");
    this._.nake.setAttribute("dy", ".92em");
    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("font-size", this.vars.fontSize);
    this._.nake.setAttribute("font-family", "consolas");

    if (text !== undefined && text !== null) this.text(text);
}

Text.prototype = {
    ...BaseNake.prototype
};

Text.prototype.x = Factory.handlerLowPrecise("x");
Text.prototype.y = Factory.handlerLowPrecise("y");
Text.prototype.fontSize = Factory.handlerLowPrecise("fontSize");

Text.prototype.width = function(width) {
    if (width === undefined) return this.vars.width;
    const fontSize = Text.widthToFontSize(this.vars.text, width);
    this.fontSize(fontSize);
    return this;
}

Text.prototype.height = function(height) {
    if (height === undefined) return this.vars.height;
    const fontSize = Text.heightToFontSize(this.vars.text, height);
    this.fontSize(fontSize);
    return this;
}

Text.prototype.text = function(text) {
    if (text === undefined) return this.vars.text;
    this.vars.text = Text.parseText(String(text));
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