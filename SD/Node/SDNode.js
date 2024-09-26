import { svg } from "@/Interact/Svg";

import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { InRange }           from "@/Node/Common";
import { Forward }           from "@/Node/Common";
import { GetComponent }      from "@/Node/Common";
import { GetterAndSetter }   from "@/Node/Common";
import { ForwardWithReturn } from "@/Node/Common";

import { Updater }  from "@/Node/SDNode/Update";
import { Animate }  from "@/Node/SDNode/Animate";
import { D3Layer }  from "@/Node/SDNode/D3Layer";
import { Interact } from "@/Node/SDNode/Interact";
import { Children } from "@/Node/SDNode/Children";
import { SDMember } from "@/Node/SDNode/SDMember";

let id = 0;

export function SDNode(parent) {
    if (parent === svg()) {
        svg().children.push(this);
    }
    id++;
    this.d3layer = new D3Layer(parent);
    this.d3layer.nake().setAttribute("id", id);
    this.d3layer.node = this;
    this.parent = ("g" in parent) ? parent : parent.node;
    this.children = new Children(this);
    this.id = id;
    this._ = {};
    this.animate = new Animate(this);
    this.member = new SDMember();
    this.updater = new Updater(this);
    this.interact = new Interact(this);

    // opacity
    this.member.new("global-opacity", 1);
    
    // interact
    this.member.new("clickHandle", undefined);
    this.member.new("dblClickHandle", undefined);
    this.member.new("clickTimeoutObject", undefined);

    new Action(0, 0, 0, 1, 
        Interp.numberInterp(this.d3layer.nake(), "opacity"),
        this, "global-opacity");
    
    this._.BASE_SDNODE = true;

    return this;
}

SDNode.prototype.g = GetComponent("d3layer");

SDNode.prototype.newLayer = ForwardWithReturn("d3layer", "newLayer");
SDNode.prototype.layer    = ForwardWithReturn("d3layer", "layer");

SDNode.prototype.attachTo = function(node) {
    const isSDNode = ("g" in node);
    const otherLayer = isSDNode ? node.g() : node;
    this.d3layer.attachTo(otherLayer);
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

SDNode.prototype.opacity = GetterAndSetter("global-opacity", "setByDqual");
SDNode.prototype.inRange = InRange("rect");
SDNode.prototype.remove = function() { this.opacity(0).update(); }

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
    function() {
        if (this.member.hasChanged("global-opacity")) {
            const d3layer = this.d3layer;
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("global-opacity"),
                this.member.get("global-opacity"),
                function(t) {
                    const A = this.from;
                    const B = this.to;
                    const current = (A * (1 - t) + B * t);
                    d3layer.nake().setAttribute("opacity", current);
                    if (t === 1) {
                        const isVisible = (current !== 0);
                        const choose = isVisible ? "allowPointerEvents" : "disablePointerEvents";
                        d3layer[choose]();
                    }
                },
                this, "global-opacity"
            );
            this.member.flush("global-opacity");
        }
    }
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
    this._.rule(this.parent, this);
    return this;
}
SDNode.prototype.onEnter = function(callback) {
    this._.enter = callback;
}