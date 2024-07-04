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

/**
 * 在当前节点上，新建一个名为name的图层
 * @param {number|string} name
 * @returns {D3Layer}
 */
SDNode.prototype.newLayer = function(layerName) {
    return this.d3layer.newLayer(layerName);
}

/**
 * @param {number|string} layerName 
 * @returns {D3Layer}
 */
SDNode.prototype.layer = function(layerName) {
    return this.d3layer.layer(layerName);
}

/**
 * 把当前节点附加到node节点的图层中去
 * @param {SDNode|D3Layer} node
 */
SDNode.prototype.attachTo = function(node) {
    const otherLayer = ("g" in node) ? node.g() : node;
    this.d3layer.attachTo(otherLayer);
}

/**
 * 插入一个子节点
 * @param {number|string} childName 
 * @param {SDNode} child
 * @param {(SDNode, SDNode) => void} rule
 * @returns {this}
 */
SDNode.prototype.childAs = function(childName, child, rule) {
    if (child.parent !== this) child.attachTo(this);
    this.children.push(childName, child, rule);
    this.tryUpdate();
    return this;
}

SDNode.prototype.child = function(name) {
    return this.children.child(name);
}

/**
 * 开启一段动画
 * - startAnimate(400) 开启一段持续时长400ms的动画
 * - startAnimate(node) 以node为基础开启一段动画
 * - startAnimate(250, 600) 开启一段区间范围[250, 600]的动画
 * - startAnimate() 开启一段持续时长300ms的动画
 * @overload
 * @param {number} duration
 * @returns {this}
 * @overload
 * @param {SDNode} node
 * @returns {this}
 * @overload
 * @param {number} l
 * @param {number} r
 * @returns {this}
 * @overload
 * @returns {this}
 */
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

/**
 * 查询动画的延时
 * @returns {number} 动画的延时
 */
SDNode.prototype.delay = function() {
    return this.animate.delay();
}
    
/**
 * 设置一段动画在某时间之后开始
 * @overload
 * @param {number} delay
 * @returns {this}
 * @overload
 * @param {SDNode} other
 * @returns {this}
 */
SDNode.prototype.after = function() {
    this.animate.after.apply(
        this.animate,
        arguments
    );
    return this;
}

/**
 * 查询动画持续的时间
 * @returns {number} 动画持续时间
 */
SDNode.prototype.duration = function() {
    return this.animate.duration();
}

/**
 * 操作子树内所有节点的透明度
 * @overload
 * @param {number} opacity 目标透明度
 * @returns {this}
 * @overload
 * @returns {number}
 */
SDNode.prototype.opacity = function(opacity) {
    if (opacity === undefined) {
        return this.member.get("global-opacity");
    }
    this.member.setByDqual("global-opacity", opacity);
    this.tryUpdate();
    return this;
}

/**
 * 通过x，y，mx，my，判断vec这个向量是否落在了当前节点构成的矩形中
 * @param {import("../Utility/Math").Vector} vec 向量，一个长度为2的数组
 * @returns {boolean} vec是否落在当前节点构成的矩形中
 */
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

/**
 * 获取元素在x方向上的k分位点
 * @param {number} k 
 * @returns {number}
 */
SDNode.prototype.kx = function(k) {
    return this.x() + k * this.width();
}

/**
 * 获取元素在y方向上的k分位点
 * @param {number} k 
 * @returns {number}
 */
SDNode.prototype.ky = function(k) {
    return this.y() + k * this.height();
}

/**
 * 操作元素的cx属性
 * @overload
 * @param {number} cx 
 * @returns {this}
 * @overload
 * @returns {number}
 */
SDNode.prototype.cx = function(cx) {
    if (cx === undefined) {
        return this.x() + this.width() / 2;
    }
    this.x(cx - this.width() / 2);
    return this;
}

/**
 * 操作元素的cy属性
 * @overload
 * @param {number} cy 
 * @returns {this}
 * @overload
 * @returns {number}
 */
SDNode.prototype.cy = function(cy) {
    if (cy === undefined) return this.y() + this.height() / 2;
    this.y(cy - this.height() / 2);
    return this;
}

/**
 * 将元素在x方向移动一段距离
 * @param {number} d 
 * @returns {this}
 */
SDNode.prototype.dx = function(d) {
    this.x(this.x() + d);
    return this;
}

/**
 * 将元素在y方向移动一段距离
 * @param {number} d 
 * @returns {this}
 */
SDNode.prototype.dy = function(d) {
    this.y(this.y() + d);
    return this;
}

/**
 * 操作元素的mx属性
 * @overload
 * @param {number} mx 
 * @returns {this}
 * @overload
 * @returns {number}
 */
SDNode.prototype.mx = function(mx) {
    if (mx === undefined) return this.x() + this.width();
    this.x(mx - this.width());
    return this;
}

/**
 * 操作元素的my属性
 * @overload
 * @param {number} my 
 * @returns {this}
 * @overload
 * @returns {number}
 */
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