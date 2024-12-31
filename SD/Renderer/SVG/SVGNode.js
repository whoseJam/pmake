import { Action } from "@/Animate/Action";

import { Dom } from "@/Dom/Dom";

const SHAPE_TAG = new Set(["circle", "ellipse", "foreignObject", "fragment", "image", "line", "path", "rect", "svg", "text"]);

let SVGNodeID = 0;

function AppearOrRemove(element, owner) {
    return function (t) {
        if (t !== 1) return;
        if (this.target) {
            this.target.append(element);
            requestAnimationFrame(() => {
                owner._.ready = true;
            });
        } else {
            element.remove();
            requestAnimationFrame(() => {
                owner._.ready = false;
            });
        }
    };
}

export class SVGNode {
    constructor(parent, layer, tag) {
        this.parent = parent;
        this.layer = layer;
        if (typeof tag === "string") {
            this.element = Dom.createSVGElement(tag, (this.id = ++SVGNodeID));
            this.tag = tag;
            this.appear();
        } else {
            this.element = tag;
            this.tag = Dom.tagName(tag);
            if (layer) this.appear();
        }
    }

    nake() {
        return this.element;
    }

    append(tag) {
        const result = new SVGNode(this.parent, this.layer, tag);
        this.nake().append(result.nake());
        return result;
    }

    moveTo(layer) {
        const element = Snap(this.nake());
        new Action(
            this.parent.delay() + this.parent.duration(),
            this.parent.delay() + this.parent.duration(),
            Snap(this.layer.nake()),
            Snap(layer.nake()),
            function (t) {
                if (t !== 1) return;
                this.target.append(element);
            },
            this,
            "moveTo"
        );
        this.layer = layer;
    }

    appear() {
        if (this.parent === undefined) {
            this.layer.nake().appendChild(this.nake());
            return;
        }
        new Action(this.parent.delay() + this.parent.duration(), this.parent.delay() + this.parent.duration(), undefined, Snap(this.layer.nake()), AppearOrRemove(Snap(this.nake()), this.parent), this, "appear");
        new Action(this.parent.delay() + this.parent.duration(), this.parent.delay() + this.parent.duration(), 0, 1, () => {}, this.parent, "opacity");
    }

    remove() {
        new Action(this.parent.delay() + this.parent.duration(), this.parent.delay() + this.parent.duration(), Snap(this.layer.nake()), undefined, AppearOrRemove(Snap(this.nake()), this.parent), this, "remove");
    }

    setAttribute(key, value) {
        if (key === "innerHTML") {
            this.element.innerHTML = value;
        } else if (key === "pointer-events" || key === "min-width" || key === "min-height" || key === "display") {
            this.element.style[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    }

    getAttribute(key) {
        return this.element.getAttribute(key);
    }

    hasShape() {
        return SHAPE_TAG.has(this.tag);
    }

    getParent() {
        return this.parent;
    }
}
