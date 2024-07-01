import { Action } from "../Animate/Action";
import { Children } from "./Children";
import { D3Layer } from "./D3Layer";
import { d3ToNake } from "../Utility/Tool";
import { Interp } from "../Animate/Interp";
import { svg } from "../Interact/Svg";
import { equal } from "../Utility/Math";
import { Animate } from "./Animate";
import { SDMember } from "./SDMember";

let id = 0;

/**
 * @class SDNode
 * @description SDNode的基类
 */
export class SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        if (node === svg()) svg().children.push(this);
        this.d3layer = new D3Layer(node);
        this.d3layer.node = this;
        this.parent = ("g" in node) ? node : node.node;
        this.children = new Children(this);
        this.sdNodeId = ++id;
        this.id = id;
        this._ = {};
        this.animate = new Animate(this);
        this.member = new SDMember();

        this.member.new("global-opacity", 1);

        // console.log("create node id =", this.sdNodeId, "this =", this);

        new Action(0, 0, 0, 1, 
            Interp.numberInterp(this.d3layer.nake(), "opacity"),
            this, "opacity");
    }

    /**
     * 获取当前节点的图层
     * @returns {D3Layer}
     */
    g() {
        return this.d3layer;
    }

    /**
     * 在当前节点上，新建一个名为name的图层
     * @param {number|string} name
     * @returns {D3Layer}
     */
    newLayer(layerName) {
        return this.d3layer.newLayer(layerName);
    }

    /**
     * @param {number|string} layerName 
     * @returns {D3Layer}
     */
    layer(layerName) {
        return this.d3layer.layer(layerName);
    }

    /**
     * 把当前节点附加到node节点的图层中去
     * @param {SDNode|D3Layer} node
     */
    attachTo(node) {
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
    childAs(childName, child, rule) {
        if (child.parent !== this) child.attachTo(this);
        this.children.push(childName, child, rule);
        this.dirty(this, "R");
        return this;
    }

    /**
     * 查询名为name的子节点
     * @param {number|string} name 
     * @returns {SDNode}
     */
    child(name) {
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
    startAnimate() {
        this.animate.startAnimate.apply(
            this.animate,
            arguments
        );
        return this;
    }

    /**
     * 结束一段动画
     * @returns {this}
     */
    endAnimate() {
        this.animate.endAnimate.apply(
            this.animate,
            arguments
        );
        return this;
    }
    
    /**
     * 查询节点是否正处于动画状态中
     * @returns {boolean}
     */
    isAnimating() {
        return this.animate.isAnimating();
    }

    /**
     * 查询动画的延时
     * @returns {number} 动画的延时
     */
    delay() {
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
    after() {
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
    duration() {
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
    opacity(opacity) {
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
    inRange(vec) {
        return this.x() <= vec[0] && vec[0] <= this.mx() &&
               this.y() <= vec[1] && vec[1] <= this.my();
    }

    remove() {
        this.opacity(0);
    }

    // --------------------位置函数--------------------
    // 通用定位，返回一个点的坐标
    pos(xloc, yloc, dx = 0, dy = 0) {
        return [
            this[xloc]() + dx,
            this[yloc]() + dy
        ];
    }

    /**
     * 设置元素的x属性
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        throw new Error("Not Implemented Yet");
    }
    
    /**
     * 设置元素的y属性
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        throw new Error("Not Implemented Yet");
    }

    /**
     * 操作元素的width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        throw new Error("Not Implemented Yet");
    }

    /**
     * 操作元素的height属性
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        throw new Error("Not Implemented Yet");
    }

    /**
     * 获取元素在x方向上的k分位点
     * @param {number} k 
     * @returns {number}
     */
    kx(k) {
        return this.x() + k * this.width();
    }

    /**
     * 获取元素在y方向上的k分位点
     * @param {number} k 
     * @returns {number}
     */
    ky(k) {
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
    cx(cx) {
        if (cx === undefined) return this.x() + this.width() / 2;
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
    cy(cy) {
        if (cy === undefined) return this.y() + this.height() / 2;
        this.y(cy - this.height() / 2);
        return this;
    }

    /**
     * 将元素在x方向移动一段距离
     * @param {number} d 
     * @returns {this}
     */
    dx(d) {
        this.x(this.x() + d);
        return this;
    }

    /**
     * 将元素在y方向移动一段距离
     * @param {number} d 
     * @returns {this}
     */
    dy(d) {
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
    mx(mx) {
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
    my(my) {
        if (my === undefined) return this.y() + this.height();
        this.y(my - this.height());
        return this;
    }


    preUpdate() {
        this.children.forEach(child => {
            child.freeze();
        })
    }

    postUpdate() {
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

    tryMove(element, move) {
        if (element._.enter) {
            element._.enter(element, move);
            element._.enter = undefined;
        } else {
            move();
        }
    }

    update() {
        if (this.member.hasChanged("global-opacity")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("global-opacity"), 
                this.member.get("global-opacity"),
                Interp.numberInterp(this.d3layer.nake(), "opacity"),
                this, "opacity"
            );
            this.member.flush("global-opacity");
        }
    }

    freeze() {
        this._.freeze = true;
        return this;
    }

    unfreeze() {
        this._.freeze = false;
        if (this._.pendUpdate) {
            this._.pendUpdate = false;
            this.update();
        }
        return this;
    }

    freezing() {
        return this._.freeze;
    }

    pendUpdate() {
        this._.pendUpdate = true;
    }

    tryUpdate() {
        if (this.freezing()) {
            this.pendUpdate();
        } else {
            this.update();
        }
    }
}
