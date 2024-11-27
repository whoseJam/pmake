import { Action } from "@/Animate/Action";

import { Updater }  from "@/Node/SDNode/Updater";
import { Animate }  from "@/Node/SDNode/Animate";
import { Interact } from "@/Node/SDNode/Interact";
import { Children } from "@/Node/SDNode/Children";
import { SDMember } from "@/Node/SDNode/SDMember";
import { Location } from "@/Node/SDNode/Location";

import { SVGNode } from "@/Renderer/SVG/SVGNode";

import { Vector } from "@/Math/Vector";

import { Check } from "@/Utility/Check";

let SDNodeID = 0;

export function SDNode(parent, layer = undefined) {
    SDNodeID++;

    this.id     = SDNodeID;
    this.member = new SDMember();
    this._      = {
        layer:    undefined,
        layers:   {},
        parent:   undefined,
        animate:  new Animate(this),
        updater:  new Updater(this),
        children: new Children(this),
        interact: new Interact(this),
    };

    if (Check.isTypeOfSDNode(parent)) {
        // parent is SDNode
        this._.parent = parent;
        if (!layer) {
            this._.layer = new SVGNode(this, parent.layer(), "g");
        } else {
            // appear later, layer is undefined
            this._.layer = new SVGNode(this, undefined, layer);
        }
    } else {
        // parent is RenderNode
        this._.parent = parent.getParent();
        if (!layer) {
            this._.layer = new SVGNode(this, parent, "g");
        } else {
            // appear later, layer is undefined
            this._.layer = new SVGNode(this, undefined, layer);
        }

    }

    this.member.new("opacity", 1);
    
    this._.BASE_SDNODE = true;
}

SDNode.forward = function(comp, func) {
    return function() {
        const component = this._[comp];
        component[func].apply(component, arguments);
        return this;
    };
}

SDNode.forwardWithReturn = function(comp, func) {
    return function() {
        const component = this._[comp];
        return component[func].apply(component, arguments);
    };
}

SDNode.ordinaryGetterAndSetter = function(key, mode) {
    return function(value) {
        if (value === undefined) {
            return this.member.get(key);
        }
        this.member[mode](key, value);
        this.tryUpdate();
        return this;
    };
}

SDNode.OrdinaryGSet = function(key, mode) {
    return function(value) {
        if (value === undefined) {
            return this.member.get(key);
        }
        this.member[mode](key, value);
        this.tryUpdate();
        return this;
    }
}

SDNode.ordinaryUpdate = function(key, interp, target, attr) {
    const targetKey = target ? target : "nake";
    const interpKey = attr ? attr : key;
    return function() {
        if (this.member.hasChanged(key)) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue(key),
                this.member.get(key),
                interp(this._[targetKey], interpKey),
                this, key
            );
            this.member.flush(key);
        }
    }
}

SDNode.OrdinaryUpdate = function(key, interp, target, attr) {
    const targetKey = target ? target : "nake";
    const interpKey = attr ? attr : key;
    return function() {
        if (this.member.hasChanged(key)) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue(key),
                this.member.get(key),
                interp(this._[targetKey], interpKey),
                this, key
            );
            this.member.flush(key);
        }
    }
}

SDNode.InRange = function(mode) {
    if (mode === "circle") {
        return function(vec) {
            const center = [this.cx(), this.cy()];
            const length = Vector.getIns().length(Vector.getIns().sub(vec, center));
            return length <= this.r();
        }
    } else if (mode === "rect") {
        return function(vec) {
            return (this.x() <= vec[0] && vec[0] <= this.mx() &&
                    this.y() <= vec[1] && vec[1] <= this.my());
        }
    } else {
        throw new Error(`Unknown Mode ${mode}`);
    }
}

SDNode.prototype.type = function(type) {
    this._.layer.setAttribute("type", type);
    return this;
}

SDNode.prototype.layer = function(name) {
    return name === undefined ? this._.layer : this._.layers[name];
}

SDNode.prototype.newLayer = function(name) {
    const layer = new SVGNode(this, this._.layer, "g");
    this._.layers[name] = layer;
    layer.setAttribute("layer", name);
    return this;
}

SDNode.prototype.attachTo = function(parent) {
    if (Check.isTypeOfSDNode(parent)) {
        // parent is SDNode
        this._.layer.moveTo(parent.layer());
    } else {
        // parent is RenderNode
        this._.layer.moveTo(parent);
    }
    return this;
}

SDNode.prototype.childAs = function() {
    const args = [...arguments];
    const child = args.filter(arg => Check.isTypeOfSDNode(arg))[0];
    child.attachTo(this);
    const rule = args[args.indexOf(child) + 1];
    this._.children.push(args[0], args[1], args[2]);
    // TODO: 当使用 fromExist 的时候，这里使用 rule 会有问题
    // if (rule) rule(this, child);
    this.tryUpdate();
    return this;
}

SDNode.prototype.child      = SDNode.forwardWithReturn("children", "child");
SDNode.prototype.eraseChild = SDNode.forwardWithReturn("children", "erase");

SDNode.prototype.startAnimate = SDNode.forward("animate", "startAnimate");
SDNode.prototype.endAnimate   = SDNode.forward("animate", "endAnimate");
SDNode.prototype.isAnimating  = SDNode.forwardWithReturn("animate", "isAnimating");
SDNode.prototype.delay        = SDNode.forwardWithReturn("animate", "delay");
SDNode.prototype.after        = SDNode.forward("animate", "after");
SDNode.prototype.duration     = SDNode.forwardWithReturn("animate", "duration");

SDNode.prototype.opacity = SDNode.OrdinaryGSet("opacity", "setByDqual");
SDNode.prototype.inRange = SDNode.InRange("rect");
SDNode.prototype.remove  = function() { this._.layer.remove(); }

SDNode.prototype.scale  = Location.scale;
SDNode.prototype.pos    = Location.position;
SDNode.prototype.center = Location.center;
SDNode.prototype.kx     = Location.kQuantileLocation("x", "width");
SDNode.prototype.ky     = Location.kQuantileLocation("y", "height");
SDNode.prototype.cx     = Location.centerLocation("x", "width");
SDNode.prototype.cy     = Location.centerLocation("y", "height");
SDNode.prototype.mx     = Location.maxiumLocation("x", "width");
SDNode.prototype.my     = Location.maxiumLocation("y", "height");
SDNode.prototype.dx     = Location.moveLocation("x");
SDNode.prototype.dy     = Location.moveLocation("y");

SDNode.prototype.update       = SDNode.forward("updater", "update");
SDNode.prototype.updating     = SDNode.forwardWithReturn("updater", "updating");
SDNode.prototype.preUpdate    = SDNode.forward("updater", "preUpdate");
SDNode.prototype.postUpdate   = SDNode.forward("updater", "postUpdate");
SDNode.prototype.tryUpdate    = SDNode.forward("updater", "tryUpdate");
SDNode.prototype.pendUpdate   = SDNode.forward("updater", "pendUpdate");
SDNode.prototype.attachUpdate = SDNode.forward("updater", "attachUpdate");
SDNode.prototype.removeUpdate = SDNode.forward("updater", "removeUpdate");
SDNode.prototype.tryMove      = SDNode.forward("updater", "tryMove");
SDNode.prototype.freeze       = SDNode.forward("updater", "freeze");
SDNode.prototype.unfreeze     = SDNode.forward("updater", "unfreeze");
SDNode.prototype.freezing     = SDNode.forward("updater", "freezing");
SDNode.prototype.updateList = [
    function() {
        const layer = this._.layer;
        if (this.member.hasChanged("opacity")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("opacity"),
                this.member.get("opacity"),
                function(t) {
                    const k = this.source + (this.target - this.source) * t;
                    layer.setAttribute("opacity", k);
                    if (t === 1) {
                        layer.setAttribute("pointer-events", k === 0 ? "none" : "auto");
                    }
                },
                this, "opacity"
            )
            this.member.flush("opacity");
        }
    }
];

SDNode.prototype.drag       = SDNode.forward("interact", "drag");
SDNode.prototype.clickable  = function(type) {
    this._.layer.setAttribute("pointer-event", Check.isFalseType(type) ? "none" : "auto");
    return this;
}
SDNode.prototype.onClick    = SDNode.forward("interact", "onClick");
SDNode.prototype.onDblClick = SDNode.forward("interact", "onDblClick");

SDNode.prototype.rule = function(rule) {
    if (rule === undefined) return this._.rule;
    this._.rule = rule;
    return this;
}

SDNode.prototype.triggerRule = function() {
    if (!this._.rule) return this;
    this._.rule(this._.parent, this);
    return this;
}

SDNode.prototype.onEnter = function(enter) {
    this._.enter = enter;
    return this;
}

SDNode.prototype.triggerEnter = function(move) {
    if (!this._.enter) return this;
    this._.enter(this, move);
    return this;
}

SDNode.prototype.onExit = function(callback) {
    if (callback === undefined) {
        if (this._.exit) this._.exit(this);
        this._.exit = undefined;
        return;
    }
    this._.exit = callback;
    return this;
}

SDNode.prototype.triggerExit = function() {
    if (!this._.exit) return this;
    this._.exit(this);
    return this;
}

SDNode.prototype.title = function(title) {
    const titleElment = new SVGNode(this, this._.layer, "title");
    titleElment.setAttribute("innerHTML", title);
    return this;
}