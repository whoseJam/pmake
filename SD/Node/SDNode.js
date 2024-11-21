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

let sid = 0;

export function SDNode(parent, layer = undefined) {
    sid++;
    this.id = sid;

    this.member = new SDMember();

    this._ = {};
    this._.animate = new Animate(this);
    this._.children = new Children(this);
    this._.updater = new Updater(this);
    this._.interact = new Interact(this);

    // 1. SDNode
    // 2. SVGNode
    this._.parent = parent instanceof SVGNode ? parent.parent : parent; // 指向上一个 SDNode

    // layer
    if (!layer) {
        this._.layer = new SVGNode(this, parent instanceof SVGNode ? parent : parent.layer(), "g");
    } else {
        this._.layer = new SVGNode(this, undefined, layer);
    }
    this._.layers = {};

    // opacity
    this.member.new("opacity", 1);
    
    this._.BASE_SDNODE = true;
}

SDNode.Forward = function(componentName, functionName) {
    return function() {
        const component = this._[componentName];
        component[functionName].apply(component, arguments);
        return this;
    }
}

SDNode.ForwardWithReturn = function(componentName, functionName) {
    return function() {
        const component = this._[componentName];
        return component[functionName].apply(component, arguments);
    }
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
}

SDNode.prototype.layer = function(name) {
    if (name === undefined) {
        return this._.layer;
    } else {
        return this._.layers[name];
    }
}

SDNode.prototype.newLayer = function(name) {
    const layer = new SVGNode(this, this._.layer, "g");
    this._.layers[name] = layer;
    layer.setAttribute("layer", name);
}

SDNode.prototype.attachTo = function(parent) {
    // 1. parent = SDNode -> parent.layer()
    // 2. parent = RenderNode -> this
    this._.layer.moveTo(typeof(parent.layer) === "function" ? parent.layer() : parent);
    return this;
}

SDNode.prototype.childAs = function(childName, child, rule) {
    for (let i = 0; i < arguments.length; i++) {
        if (Check.isTypeOfSDNode(arguments[i])) {
            arguments[i].attachTo(this);
        }
    }
    this._.children.push(childName, child, rule);
    this.tryUpdate();
    return this;
}

SDNode.prototype.eraseChild = function(child) {
    return this._.children.erase(child);
}

SDNode.prototype.child = SDNode.ForwardWithReturn("children", "child");

SDNode.prototype.startAnimate = SDNode.Forward("animate", "startAnimate");
SDNode.prototype.endAnimate   = SDNode.Forward("animate", "endAnimate");
SDNode.prototype.isAnimating  = SDNode.ForwardWithReturn("animate", "isAnimating");
SDNode.prototype.delay        = SDNode.ForwardWithReturn("animate", "delay");
SDNode.prototype.after        = SDNode.Forward("animate", "after");
SDNode.prototype.duration     = SDNode.ForwardWithReturn("animate", "duration");

SDNode.prototype.opacity = SDNode.OrdinaryGSet("opacity", "setByDqual");
SDNode.prototype.inRange = SDNode.InRange("rect");
SDNode.prototype.remove = function() { this._.layer.remove(); }

SDNode.prototype.scale = Location.scale;
SDNode.prototype.pos = Location.position;
SDNode.prototype.center = Location.center;
SDNode.prototype.kx = Location.kQuantileLocation("x", "width");
SDNode.prototype.ky = Location.kQuantileLocation("y", "height");
SDNode.prototype.cx = Location.centerLocation("x", "width");
SDNode.prototype.cy = Location.centerLocation("y", "height");
SDNode.prototype.mx = Location.maxiumLocation("x", "width");
SDNode.prototype.my = Location.maxiumLocation("y", "height");
SDNode.prototype.dx = Location.moveLocation("x");
SDNode.prototype.dy = Location.moveLocation("y");

SDNode.prototype.preUpdate    = SDNode.Forward("updater", "preUpdate");
SDNode.prototype.postUpdate   = SDNode.Forward("updater", "postUpdate");
SDNode.prototype.tryMove      = SDNode.Forward("updater", "tryMove");
SDNode.prototype.update       = SDNode.Forward("updater", "update");
SDNode.prototype.freeze       = SDNode.Forward("updater", "freeze");
SDNode.prototype.unfreeze     = SDNode.Forward("updater", "unfreeze");
SDNode.prototype.freezing     = SDNode.Forward("updater", "freezing");
SDNode.prototype.pendUpdate   = SDNode.Forward("updater", "pendUpdate");
SDNode.prototype.tryUpdate    = SDNode.Forward("updater", "tryUpdate");
SDNode.prototype.attachUpdate = SDNode.Forward("updater", "attachUpdate");
SDNode.prototype.removeUpdate = SDNode.Forward("updater", "removeUpdate");

SDNode.prototype.drag       = SDNode.Forward("interact", "drag");
SDNode.prototype.onClick    = SDNode.Forward("interact", "onClick");
SDNode.prototype.onDblClick = SDNode.Forward("interact", "onDblClick");

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
]

SDNode.prototype.rule = function(rule) {
    if (rule === undefined) {
        return this._.rule;
    }
    this._.rule = rule;
    return this;
}

SDNode.prototype.triggerRule = function() {
    this._.rule(this._.parent, this);
    return this;
}

SDNode.prototype.onEnter = function(callback) {
    this._.enter = callback;
}

SDNode.prototype.clickable = function(type) {
    if (Check.isFalseType(type)) {
        this._.layer.setAttribute("pointer-event", "none");
    } else {
        this._.layer.setAttribute("pointer-event", "auto");
    }
    return this;
}

SDNode.prototype.title = function(title) {
    const titleElment = new SVGNode(this, this._.layer, "title");
    titleElment.setAttribute("innerHTML", title);
    return this;
}