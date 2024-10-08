import { Fragment } from "@/Node/Nake/Fragment";
import { Dom } from "@/Dom/Dom";
import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "../SDNode";

function castStringToViewBox(str) {
    const result = str.split(" ");
    return {
        viewX: +result[0],
        viewY: +result[1],
        viewWidth: +result[2],
        viewHeight: +result[3]
    };
}

export function Mathjax(parent, text) {
    SDNode.call(this, parent);

    this.type("Mathjax");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("text", "");
    this.member.new("font-size", 20);

    if (text) this.math(text);
}

Mathjax.prototype = {
    ...SDNode.prototype
};

Mathjax.prototype.updateList = [
    ...Mathjax.prototype.updateList,
    function() {
        if (this.member.hasChanged("font-size")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("font-size"),
                this.member.get("font-size"),
                Interp.numberInterp(this._.layer, "font-size"),
                this, "font-size"
            );
            this.member.flush("font-size");
        }
    },
    function() {
        if (this.member.hasChanged("x") ||
            this.member.hasChanged("y")) {
            const old = [this.member.oldValue("x"), this.member.oldValue("y")];
            const cur = [this.member.getAndFlush("x"), this.member.getAndFlush("y")];
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                old, cur,
                Interp.translateInterp(this._.layer, "transform"),
                this, "translate"
            );
        }
    }
]

Mathjax.prototype.math = function(text) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    const svg = MathJax.tex2svg(text).children[0];
    this._.layer.element.append(svg);
    // this.fragment(svg.outerHTML);
    return this;
}

Mathjax.prototype.x        = SDNode.OrdinaryGSet("x", "setByEqual");
Mathjax.prototype.y        = SDNode.OrdinaryGSet("y", "setByEqual");
Mathjax.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual");

Mathjax.prototype.text = function() {
    return this.member.get("text");
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

Mathjax.prototype.replaceMath = function(text) {
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    const svg = MathJax.tex2svg(text).children[0];
    const oldSvg = this._.layer.element.children[0];
    ReplaceMathjax(oldSvg, svg, this.delay(), this.duration());
    // this._.nake.element.removeChild(oldSvg);
    // this.fragment(svg.outerHTML);
    console.log(oldSvg, svg);
    return this;
}

function ParseMathjax(root, replace) {
    const elements = [];
    function dfs(current) {
        if (!Dom.tagName(current)) return;
        if (Dom.tagName(current) === "defs") return;
        if (Dom.tagName(current) === "use") {
            const href = current.getAttribute("xlink:href");
            const data = current.getAttribute("data-c");
            const path = root.getElementById(href.slice(1));
            const parent = Dom.parent(current);
            if (replace) {
                const pathClone = Dom.createSVGElement("path");
                pathClone.setAttribute("d", path.getAttribute("d"));
                parent.append(pathClone);
                parent.removeChild(current);
                elements.push(pathClone);
            } 
            else {
                elements.push(path.getAttribute("d"));
            }
            return;
        } else if (Dom.tagName(current) === "path") {
            if (replace) {
                elements.push(current);
            }
            return;
        }
        for (let child of current.children) {
            dfs(child);
        }
    }
    dfs(root);
    console.log("Element=", elements);
    return elements;
}

function ReplaceMathjax(oldSvg, newSvg, delay, duration) {
    const v1 = ParseMathjax(oldSvg, true);
    const v2 = ParseMathjax(newSvg, false);
    new Action(
        delay,
        delay + duration,
        castStringToViewBox(oldSvg.getAttribute("viewBox")),
        castStringToViewBox(newSvg.getAttribute("viewBox")),
        Interp.viewBoxInterp(oldSvg, "viewBox"),
        this, "viewBox"
    );
    for (let i = 0; i < v1.length; i++) {
        const snap = Snap(v1[i]);
        new Action(
            delay,
            delay + duration,
            v1[i].getAttribute("d"),
            v2[i],
            function(t) {
                if (t === 0) {
                    if (duration === 0) {
                        snap.attr({ d: this.to });
                    } else {
                        snap.animate({ d: this.to }, duration, mina.easeinout);
                    }
                } else if (t === 1) {
                    snap.attr({ d: this.to });
                }
            },
            i, "d"
        );
    }
}