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
    this.member.new("width", 0);
    this.member.new("height", 0);
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
    if (text === undefined) return this.text();
    if (text.startsWith("$")) text = text.slice(1, -1);
    this.member.setAndFlush("text", text);
    const svg = MathJax.tex2svg(text).children[0];
    const box = Mathjax.GetBox(svg);
    this.member.setAndFlush("width", box.width);
    this.member.setAndFlush("height", box.height);
    this._.layer.element.append(svg);
    return this;
}

Mathjax.prototype.x        = SDNode.OrdinaryGSet("x", "setByEqual");
Mathjax.prototype.y        = SDNode.OrdinaryGSet("y", "setByEqual");
Mathjax.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual");

Mathjax.prototype.text = function() {
    return this.member.get("text");
}

Mathjax.prototype.width = function(width) {
    const w = this.member.get("width");
    const fontSize = this.member.get("font-size");
    if (width === undefined) return w * fontSize / 20;
    if (w === 0) return this;
    const k = width / w;
    this.fontSize(20 * k);
    return this;
}


Mathjax.prototype.height = function(height) {
    const h = this.member.get("height");
    const fontSize = this.member.get("font-size");
    if (height === undefined) return h * fontSize / 20;
    if (h === 0) return this;
    const k = height / h;
    this.fontSize(20 * k);
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
                    console.log("snap.attr=", snap.attr("d"));
                    console.log("from=", this.from);
                    console.log("to=", this.to);
                    setTimeout(() => {
                        snap.attr({ d: this.to });
                    }, 50);
                }
            },
            i, "d"
        );
    }
}

Mathjax.Init = function() {
    Mathjax.helper = Dom.createSVGElement("g");
    Dom.getByID("1").append(Mathjax.helper);
    Mathjax.helper.setAttribute("opacity", 0);
    Mathjax.helper.setAttribute("font-size", 20);
}

Mathjax.GetBox = function(svg) {
    Mathjax.helper.append(svg);
    return Mathjax.helper.getBBox();
}