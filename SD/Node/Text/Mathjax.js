import { Fragment } from "@/Node/Nake/Fragment";

export function Mathjax(parent, text) {
    Fragment.call(this, parent);

    this.g().type("Mathjax");

    if (text) {
        this.math(text);
    }

    return this;
}

Mathjax.prototype = {
    ...Fragment.prototype
};

Mathjax.prototype.math = function(text) {
    const svg = MathJax.tex2svg(text).children[0];
    this.fragment(svg.outerHTML);
    return this;
}

Mathjax.prototype.width = function(width) {
    const owidth = this.member.get("width");
    const oheight = this.member.get("height");
    if (width === undefined)
        return owidth;
    const k = width / owidth;
    this.member.set("width", owidth * k);
    this.member.set("height", oheight * k);
    this.tryUpdate();
    return this;
}


Mathjax.prototype.height = function(height) {
    const owidth = this.member.get("width");
    const oheight = this.member.get("height");
    if (height === undefined)
        return oheight;
    const k = height / oheight;
    this.member.set("width", owidth * k);
    this.member.set("height", oheight * k);
    this.tryUpdate();
    return this;
}