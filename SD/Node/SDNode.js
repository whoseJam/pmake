import { svg } from "@/Interact/Svg";

import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { Forward, ForwardWithReturn }  from "@/Node/Common";
import { Animate }  from "@/Node/Animate";
import { D3Layer }  from "@/Node/D3Layer";
import { Children } from "@/Node/Children";
import { SDMember } from "@/Node/SDMember";

import { D3ToNake } from "@/Utility/Cast";

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
SDNode.prototype.layer = ForwardWithReturn("d3layer", "layer");

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

SDNode.prototype.child = function(name) {
    return this.children.child(name);
}

SDNode.prototype.startAnimate = Forward("animate", "startAnimate");
SDNode.prototype.endAnimate   = Forward("animate", "endAnimate");
SDNode.prototype.isAnimating  = ForwardWithReturn("animate", "isAnimating");
SDNode.prototype.delay        = ForwardWithReturn("animate", "delay");
SDNode.prototype.after        = Forward("animate", "after");
SDNode.prototype.duration     = ForwardWithReturn("animate", "duration");

SDNode.prototype.opacity = function(opacity) {
    if (opacity === undefined) {
        return this.member.get("global-opacity");
    }
    this.member.setByDqual("global-opacity", opacity);
    this.tryUpdate();
    return this;
}

SDNode.prototype.inRange = function(vec) {
    return this.x() <= vec[0] && vec[0] <= this.mx() &&
           this.y() <= vec[1] && vec[1] <= this.my();
}

SDNode.prototype.remove = function() {
    this.opacity(0);
}

SDNode.prototype.scale = function(scale) {
    const width = this.width();
    const height = this.height();
    this.width(width * scale);
    this.height(height * scale);
    return this;
}

SDNode.prototype.pos = function(xloc, yloc, dx = 0, dy = 0) {
    return [
        this[xloc]() + dx,
        this[yloc]() + dy
    ];
}

SDNode.prototype.center = function(cx, cy) {
    if (cx === undefined) {
        return [this.cx(), this.cy()];
    } else if (arguments.length === 1) {
        const center = arguments[0];
        return this.center(center[0], center[1]);
    }
    this.cx(cx);
    this.cy(cy);
    return this;
}

SDNode.prototype.kx = function(k) {
    return this.x() + k * this.width();
}

SDNode.prototype.ky = function(k) {
    return this.y() + k * this.height();
}

SDNode.prototype.cx = function(cx) {
    if (cx === undefined) {
        return this.x() + this.width() / 2;
    }
    this.x(cx - this.width() / 2);
    return this;
}

SDNode.prototype.cy = function(cy) {
    if (cy === undefined) {
        return this.y() + this.height() / 2;
    }
    this.y(cy - this.height() / 2);
    return this;
}

SDNode.prototype.dx = function(d) {
    this.x(this.x() + d);
    return this;
}

SDNode.prototype.dy = function(d) {
    this.y(this.y() + d);
    return this;
}

SDNode.prototype.mx = function(mx) {
    if (mx === undefined) return this.x() + this.width();
    this.x(mx - this.width());
    return this;
}

SDNode.prototype.my = function(my) {
    if (my === undefined) return this.y() + this.height();
    this.y(my - this.height());
    return this;
}

SDNode.prototype.preUpdate = function() {
    this.children.forEach(child => {
        child.freeze();
    })
}

SDNode.prototype.postUpdate = function() {
    this.children.forEach(child => {
        const rule = child._.rule;
        if (!rule) {
            return;
        }
        this.tryMove(child, () => {
            rule(this, child);
        });
    });
    this.children.forEach(child => {
        child.unfreeze();
    })
}

SDNode.prototype.tryMove = function(element, move) {
    if (element._.enter) {
        element._.enter(element, move);
        element._.enter = undefined;
    } else {
        move();
    }
}

SDNode.prototype.update = function() {
    this.preUpdate();
    this.updateList.forEach(updateCallback => {
        updateCallback.call(this);
    });
    this.postUpdate();
    return this;
}

SDNode.prototype.freeze = function() {
    this.member.incBy("freeze", 1);
    return this;
}

SDNode.prototype.unfreeze = function() {
    this.member.decBy("freeze", 1);
    const freeze = this.member.get("freeze");
    if (freeze > 0) {
        return this;
    }
    if (freeze < 0) {
        throw new Error("Too Many Unfreeze Operation");
    }
    const pendUpdate = this.member.get("pendUpdate");
    if (pendUpdate) {
        this.member.set("pendUpdate", false);
        this.update();
    }
    return this;
}

SDNode.prototype.freezing = function() {
    return this.member.get("freeze") > 0;
}

SDNode.prototype.pendUpdate = function() {
    this.member.set("pendUpdate", true);
    return this;
}

SDNode.prototype.tryUpdate = function() {
    if (this.freezing()) {
        this.pendUpdate();
    } else {
        this.update();
    }
}

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

SDNode.prototype.onClick = function(callback) {
    const nake = D3ToNake(this.d3layer.d3);
    nake.removeEventListener("click", this.member.get("clickHandle"));
    this.member.setAndFlush("clickHandle", () => {
        clearTimeout(this.member.get("clickTimeoutObject"));
        this.member.set("clickTimeoutObject", setTimeout(() => {
            callback(this);
        }, 200));
    });
    nake.addEventListener("click", this.member.get("clickHandle"));
}

SDNode.prototype.onDblClick = function(callback) {
    const nake = D3ToNake(this.d3layer.d3);
    nake.removeEventListener("dblclick", this.member.get("dblClickHandle"));
    this.member.setAndFlush("dblClickHandle", () => {
        clearTimeout(this.member.get("clickTimeoutObject"));
        callback(this);
    });
    nake.addEventListener("dblclick", this.member.get("dblClickHandle"));
}

SDNode.prototype.drag = function(type) {
    if (type) {
        const nake = D3ToNake(this.d3layer.d3);
        Snap(nake).drag();
    }
    return this;
}