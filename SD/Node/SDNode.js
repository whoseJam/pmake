import { Action } from "../Animate/Action";
import { Children } from "./Children";
import { D3Layer } from "./D3Layer";
import { Interp } from "../Animate/Interp";
import { svg } from "../Interact/Svg";
import { Animate } from "./Animate";
import { SDMember } from "./SDMember";

let id = 0;

export function SDNode(parent) {
    if (parent === svg()) {
        svg().children.push(this);
    }
    this.d3layer = new D3Layer(parent);
    this.d3layer.node = this;
    this.parent = ("g" in parent) ? parent : parent.node;
    this.children = new Children(this);
    this.sdNodeId = ++id;
    this.id = id;
    this._ = {};
    this.animate = new Animate(this);
    this.member = new SDMember();

    this.member.new("global-opacity", 1);

    new Action(0, 0, 0, 1, 
        Interp.numberInterp(this.d3layer.nake(), "opacity"),
        this, "opacity");
    return this;
}

SDNode.prototype.g = function() {
    return this.d3layer;
}
SDNode.prototype.updateList = [];

SDNode.prototype.newLayer = function(layerName) {
    return this.d3layer.newLayer(layerName);
}

SDNode.prototype.layer = function(layerName) {
    return this.d3layer.layer(layerName);
}

SDNode.prototype.attachTo = function(node) {
    const otherLayer = ("g" in node) ? node.g() : node;
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

SDNode.prototype.startAnimate = function() {
    this.animate.startAnimate.apply(
        this.animate,
        arguments
    );
    return this;
}

SDNode.prototype.endAnimate = function() {
    this.animate.endAnimate.apply(
        this.animate,
        arguments
    );
    return this;
}

SDNode.prototype.isAnimating = function() {
    return this.animate.isAnimating();
}

SDNode.prototype.delay = function() {
    return this.animate.delay();
}

SDNode.prototype.after = function() {
    this.animate.after.apply(
        this.animate,
        arguments
    );
    return this;
}

SDNode.prototype.duration = function() {
    return this.animate.duration();
}

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
    this._.freeze = true;
    return this;
}

SDNode.prototype.unfreeze = function() {
    this._.freeze = false;
    if (this._.pendUpdate) {
        this._.pendUpdate = false;
        this.update();
    }
    return this;
}

SDNode.prototype.freezing = function() {
    return this._.freeze;
}

SDNode.prototype.pendUpdate = function() {
    this._.pendUpdate = true;
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
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("global-opacity"),
                this.member.get("global-opacity"),
                Interp.numberInterp(this.d3layer.nake(), "opacity"),
                this, "global-opacity"
            );
            this.member.flush("global-opacity");
        }
    }
]