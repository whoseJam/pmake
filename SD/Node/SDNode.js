import { svg } from "@/Interact/Svg";

import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { InRange }           from "@/Node/Common";
import { Forward }           from "@/Node/Common";
import { GetterAndSetter }   from "@/Node/Common";
import { ForwardWithReturn } from "@/Node/Common";

import { Animate }  from "@/Node/Animate";
import { D3Layer }  from "@/Node/D3Layer";
import { Children } from "@/Node/Children";
import { SDMember } from "@/Node/SDMember";

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

    // update
    this.member.new("freeze", 0);
    this.member.new("pendUpdate", false);

    // opacity
    this.member.new("global-opacity", 1);
    
    // interact
    this.member.new("clickHandle", undefined);
    this.member.new("dblClickHandle", undefined);
    this.member.new("clickTimeoutObject", undefined);

    new Action(0, 0, 0, 1, 
        Interp.numberInterp(this.d3layer.nake(), "opacity"),
        this, "global-opacity");
    return this;
}

SDNode.prototype.g = function() {
    return this.d3layer;
}

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
SDNode.prototype.remove = function() { this.opacity(0); }

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

import { Freeze }     from "@/Node/SDNode/Update";
import { Update }     from "@/Node/SDNode/Update";
import { TryMove }    from "@/Node/SDNode/Update";
import { Freezing }   from "@/Node/SDNode/Update";
import { Unfreeze }   from "@/Node/SDNode/Update";
import { TryUpdate }  from "@/Node/SDNode/Update";
import { PreUpdate }  from "@/Node/SDNode/Update";
import { PostUpdate } from "@/Node/SDNode/Update";
import { PendUpdate } from "@/Node/SDNode/Update";
SDNode.prototype.preUpdate  = PreUpdate;
SDNode.prototype.postUpdate = PostUpdate;
SDNode.prototype.tryMove    = TryMove;
SDNode.prototype.update     = Update;
SDNode.prototype.freeze     = Freeze;
SDNode.prototype.unfreeze   = Unfreeze;
SDNode.prototype.freezing   = Freezing;
SDNode.prototype.pendUpdate = PendUpdate;
SDNode.prototype.tryUpdate  = TryUpdate;

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

import { Drag }       from "@/Node/SDNode/Interact";
import { OnClick }    from "@/Node/SDNode/Interact";
import { OnDblClick } from "@/Node/SDNode/Interact";

SDNode.prototype.drag       = Drag;
SDNode.prototype.onClick    = OnClick;
SDNode.prototype.onDblClick = OnDblClick;