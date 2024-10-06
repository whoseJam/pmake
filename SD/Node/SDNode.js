import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { InRange }           from "@/Node/Common";
import { Forward }           from "@/Node/Common";
import { ForwardWithReturn } from "@/Node/Common";

import { Updater }  from "@/Node/SDNode/Update";
import { Animate }  from "@/Node/SDNode/Animate";
import { Interact } from "@/Node/SDNode/Interact";
import { Children } from "@/Node/SDNode/Children";
import { SDMember } from "@/Node/SDNode/SDMember";

import { SVGNode } from "@/Renderer/SVG/SVGNode";

import { Vector } from "@/Math/Vector";

let id = 0;

export function SDNode(parent) {
    id++;
    this.children = new Children(this);
    this.id = id;
    this._ = {};
    this.animate = new Animate(this);
    this.member = new SDMember();
    this.updater = new Updater(this);
    this.interact = new Interact(this);

    // 1. SDNode
    // 2. SVGNode
    this._.parent = parent instanceof SVGNode ? parent.parent : parent; // 指向上一个 SDNode

    // layer
    this._.layer = new SVGNode(this, parent instanceof SVGNode ? parent : parent.layer(), "g");
    this._.layers = {};

    // opacity
    this.member.new("opacity", 1);
    
    this._.BASE_SDNODE = true;
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

SDNode.OrdinaryUpdate = function(key, interp, target) {
    const targetKey = target ? target : "nake";
    return function() {
        if (this.member.hasChanged(key)) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue(key),
                this.member.get(key),
                interp(this._[targetKey], key),
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
            const length = Vector.length(Vector.sub(vec, center));
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
    // 1. parent = SDNode -> parent.layer
    // 2. parent = SVGNode -> parent
    this._.layer.moveTo(typeof(parent.layer) === "function" ? parent.layer() : parent);
    return this;
}

SDNode.prototype.childAs = function(childName, child, rule) {
    if (child.parent !== this) child.attachTo(this);
    this.children.push(childName, child, rule);
    this.tryUpdate();
    return this;
}

SDNode.prototype.child = ForwardWithReturn("children", "child");

SDNode.prototype.startAnimate = Forward("animate", "startAnimate");
SDNode.prototype.endAnimate   = Forward("animate", "endAnimate");
SDNode.prototype.isAnimating  = ForwardWithReturn("animate", "isAnimating");
SDNode.prototype.delay        = ForwardWithReturn("animate", "delay");
SDNode.prototype.after        = Forward("animate", "after");
SDNode.prototype.duration     = ForwardWithReturn("animate", "duration");

SDNode.prototype.opacity = SDNode.OrdinaryGSet("opacity", "setByDqual");
SDNode.prototype.inRange = InRange("rect");
SDNode.prototype.remove = function() { this._.layer.remove(); }

import { Scale }             from "@/Node/SDNode/Location";
import { Center }            from "@/Node/SDNode/Location";
import { Position }          from "@/Node/SDNode/Location";
import { CenterLocation }    from "@/Node/SDNode/Location";
import { MaxiumLocation }    from "@/Node/SDNode/Location";
import { MoveTheLocation }   from "@/Node/SDNode/Location";
import { KQuantileLocation } from "@/Node/SDNode/Location";
SDNode.prototype.scale = Scale;
SDNode.prototype.pos = Position;
SDNode.prototype.center = Center;
SDNode.prototype.kx = KQuantileLocation("x", "width");
SDNode.prototype.ky = KQuantileLocation("y", "height");
SDNode.prototype.cx = CenterLocation("x", "width");
SDNode.prototype.cy = CenterLocation("y", "height");
SDNode.prototype.mx = MaxiumLocation("x", "width");
SDNode.prototype.my = MaxiumLocation("y", "height");
SDNode.prototype.dx = MoveTheLocation("x");
SDNode.prototype.dy = MoveTheLocation("y");

SDNode.prototype.preUpdate  = Forward("updater", "preUpdate");
SDNode.prototype.postUpdate = Forward("updater", "postUpdate");
SDNode.prototype.tryMove    = Forward("updater", "tryMove");
SDNode.prototype.update     = Forward("updater", "update");
SDNode.prototype.freeze     = Forward("updater", "freeze");
SDNode.prototype.unfreeze   = Forward("updater", "unfreeze");
SDNode.prototype.freezing   = Forward("updater", "freezing");
SDNode.prototype.pendUpdate = Forward("updater", "pendUpdate");
SDNode.prototype.tryUpdate  = Forward("updater", "tryUpdate");
SDNode.prototype.attachUpdate = Forward("updater", "attachUpdate");

SDNode.prototype.updateList = [
    SDNode.OrdinaryUpdate("opacity", Interp.numberInterp, "layer")
]

SDNode.prototype.drag       = Forward("interact", "drag");
SDNode.prototype.onClick    = Forward("interact", "onClick");
SDNode.prototype.onDblClick = Forward("interact", "onDblClick");

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
