import { Action } from "@/Animate/Action";

import { Dom } from "@/Dom/Dom";

let SVGNodeID = 0;

export class SVGNode {
    constructor(parent, layer, tag) {
        this.parent = parent;
        this.layer = layer;
        this.element = Dom.createSVGElement(tag, this.id = ++SVGNodeID);
        this.appear();
    }

    append(tag) {
        const tmp = new SVGNode(this.parent, this.layer, tag);
        this.element.append(tmp.element);
        return tmp;
    }

    nake() {
        return this.element;
    }

    moveTo(layer) {
        const element = this.element;
        new Action(
            this.parent.delay() + this.parent.duration(),
            this.parent.delay() + this.parent.duration(),
            this.layer.element, layer.element,
            function(t) {
                if (t !== 1) return;
                Snap(this.target).append(Snap(element));
            },
            this, "moveTo"
        );
        this.layer = layer;
    }

    appear() {
        if (this.parent === undefined) {
            Snap(this.layer.element).append(this.element);
            return;
        }
        console.log("this.parent=", this.parent);
        const self = this;
        new Action(
            this.parent.delay() + this.parent.duration(),
            this.parent.delay() + this.parent.duration(),
            undefined, this.layer,
            function(t) {
                if (t !== 1) return;
                if (this.target === undefined) {
                    Snap(Dom.getByID(self.id)).remove();
                } else {
                    Snap(Dom.getByID(this.target.id)).append(self.element);
                }
            },
            this.parent, "appear"
        )
    }

    remove() {
        const self = this;
        new Action(
            this.parent.delay() + this.parent.duration(),
            this.parent.delay() + this.parent.duration(),
            this.layer, undefined,
            function(t) {
                if (t !== 1) return;
                if (this.target === undefined) {
                    Snap(Dom.getByID(self.id)).remove();
                } else {
                    Snap(Dom.getByID(this.target.id)).append(self.element);
                }
            },
            this, "remove"
        );
    }

    setAttribute(key, value) {
        if (key === "innerHTML") {
            this.element.innerHTML = value;
        } else if (key === "pointer-events") {
            this.element.style[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    }
}