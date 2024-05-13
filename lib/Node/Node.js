// @ts-check
import { Action } from "../Animate/Action";
import { Children } from "./Children";
import { Const } from "../Utility/Const";
import { d3ToNake } from "../Utility/Tool";
import { Interp } from "../Animate/Interp";
import { svg } from "../Interact/Svg";
import { equal } from "../Utility/Math";
import { Stack } from "../slide";

/** @type {number} */
let id = 0;

/**
 * 
 * @typedef {Object} D3Node
 * @property {SDNode} node
 * @property {any} _groups
 * @property {(arg0: string) => D3Node} append
 * @property {(arg0: string, arg1: any) => D3Node} attr
 * @extends import("d3").Selection
 * 
 * @typedef {any} SnapNode
 */

/**
 * @class Node
 * @description SDNode的基类
 */
export class SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Node} node 
     */
    constructor(node) {
        if (node === svg()) svg().children.push(this);
        
        /** @type {D3Node} */
        let parentLayer;
        if ("g" in node) {
            const sdNode = node;
            parentLayer = sdNode.g();
        } else {
            const d3Node = node;
            parentLayer = d3Node;
        }
        this.parent = parentLayer.node;
        this.children = Children(this);

        /** @type {SDNode} */
        this.isAttachTo = parentLayer.node;
        this._ = {
            /** @type {D3Node} */
            parentLayer: parentLayer,
            /** @type {number} */
            nodeId: ++id,
            /** @type {D3Node} */
            group: parentLayer.append("g"),
            /** @type {boolean} */
            animating: false,
            /** @type {number} */
            frame: -1,
            /** @type {number} */
            animateL: 0,
            /** @type {number} */
            animateR: 0,
            /** @type {number} */
            opacity: 1,
            /** @type {SDNode} */
            isDirty: undefined,
            /** @type {number} */
            dirtyByMe: 0
        };
        this._.group.node = this;

        new Action(0, 0, 0, 1, 
            Interp.numberInterp(this._.group, "opacity"),
            this, "opacity");
    }

    /**
     * 获取当前节点的图层
     * @returns {D3Node}
     */
    g() {
        return this._.group;
    }

    /**
     * 获取当前节点所创造的，名字为name的图层
     * @param {string} name
     * @returns {D3Node}
     */
    layer(name) {
        return this._[`layer_${name}`];
    }

    /**
     * 在当前节点上，新建一个名为name的图层
     * @param {string} name
     * @returns {D3Node}
     */
    newLayer(name) {
        const layer = this._.group.append("g");
        layer.attr(name, "");
        layer.node = this;
        this._["layer_" + name] = layer;
        return layer;
    }

    /**
     * 把当前节点附加到node节点的图层中去
     * @param {SDNode|D3Node} node
     */
    attachTo(node) {
        /** @type {SDNode} */
        let attachToNode;
        /** @type {D3Node} */
        let parentLayer;
        if ("g" in node) {
            /** @type {SDNode} */
            const sdNode = node;
            attachToNode = sdNode;
            parentLayer = sdNode.g();
        } else {
            /** @type {D3Node} */
            const d3Node = node;
            attachToNode = d3Node.node;
            parentLayer = d3Node;
        }
        const thisLayer = this.g();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.parentLayer,
            parentLayer,
            function(t, attr = true, firstCall, lastCall) {
                if (lastCall) {
                    // @ts-ignore
                    Snap(d3ToNake(this.to)).append(
                        // @ts-ignore
                        Snap(d3ToNake(thisLayer))
                    );
                }
            }, this, "attach-to"
        );
        this._.parentLayer = parentLayer;
        this.isAttachTo = attachToNode;
    }

    /**
     * 插入一个子节点
     * @param {string} name 
     * @param {SDNode} child
     * @param {import("../Rule/Rule").Rule} rule
     * @returns {this}
     */
    childAs(name, child, rule) {
        this.children.push(name, child, rule);
        if (child.isAttachTo !== this) child.attachTo(this);
        return this;
    }

    /**
     * 查询名为name的子节点
     * @param {string} name 
     * @returns {SDNode}
     */
    child(name) {
        return this.children.child(name);
    }

    _animate_fresh() {
        // @ts-ignore
        if (this._.frame !== window.__FRAME__) {
            // @ts-ignore
            this._.frame = window.__FRAME__;
            this._.animateL = 0;
            this._.animateR = 0;
            this._.animating = false;
        }
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
    startAnimate(other) {
        this._animate_fresh();
        let l, r;
        if (arguments.length === 0) {
            l = this.delay();
            r = l + 300;
        } else if (arguments.length === 1) {   // startAnimate(duration = 300)
            if (typeof(other) === "number") {
                l = this.delay();
                r = l + other;
            } else {
                l = other._.animateL;
                r = other._.animateR;
            }
        } else {    // startAnimate(l = 300, r = 600)
            l = arguments[0];
            r = arguments[1];
        };
        if (this._.animateL != l || this._.animateR != r)
            this.dirtyCheck(Const.DirtyChannel.any);
        this._.animateL = l;
        this._.animateR = r;
        this._.animating = true;
        this.children.forEach(child => child.startAnimate(this));
        return this;
    }

    /**
     * 结束一段动画
     * @returns {this}
     */
    endAnimate() {
        this._animate_fresh();
        this.dirtyCheck(Const.DirtyChannel.any);
        this._.animateL = this._.animateR;
        this.children.forEach(child => {
            child._.animateL = child._.animateR;
            child._.animating = false;
        })
        this._.animating = false;
        return this;
    }
    
    /**
     * 查询节点是否正处于动画状态中
     * @returns {boolean}
     */
    isAnimating() {
        this._animate_fresh();
        return this._.animating;
    }

    /**
     * 查询动画的延时
     * @returns {number} 动画的延时
     */
    delay() {
        this._animate_fresh();
        return this._.animateL;
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
    after(other) {
        this._animate_fresh();
        if (typeof(other) === "number") {
            this._.animateL = other;
            this._.animateR = other;
        } else {
            this._.animateL = other.delay();
            this._.animateR = other.delay();
        }
        return this;
    }

    /**
     * 查询动画持续的时间
     * @returns {number} 动画持续时间
     */
    duration() {
        this._animate_fresh();
        return this._.animateR - this._.animateL;
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
        if (opacity === undefined) return this._.opacity;
        if (this._.opacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.opacity, opacity,
            Interp.numberInterp(this._.group, "opacity"),
            this, "opacity"
        );
        this._.opacity = opacity;
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
        this.dirtyCheck(Const.DirtyChannel.x);
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this._.x = x;
        this.dirty(Const.DirtyChannel.x);
        return this;
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
        this.dirtyCheck(Const.DirtyChannel.y);
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this._.y = y;
        this.dirty(Const.DirtyChannel.y);
        return this;
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
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this._.width = width;
        this.dirty(Const.DirtyChannel.width);
        return this;
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
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this._.height = height;
        this.dirty(Const.DirtyChannel.height);
        return this;
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


    // --------------------延迟更新--------------------
    preUpdate() {
        this._.isDirty = undefined;
        this._.dirtyByMe = 0;
        // console.log(`--------------------Update ${this._.nodeId}:`, this, this._.x, this._.y, `--------------------`);
        // if (updateChain.length > 0 && updateChain[updateChain.length - 1] == this.constructor.name) {
        //     updateChain.push(this.constructor.name);
        //     console.log(`--------------------Update ${this._.nodeId}:`, this, `--------------------`);
        //     console.log(updateChain);
        //     console.trace();
        // } else updateChain.push(this.constructor.name);
    }
    postUpdate() {
        this.children.update();
        // updateChain.pop();
    }
    /**
     * 更新子树，移除所有dirty标记
     */
    update() {
        this.preUpdate();
        this.postUpdate();
        return this;
    }
    /**
     * 弄脏子树，深度浅的节点的dirty标记会覆盖深度深的节点的dirty标记
     * @overload
     * @param {number} dirtyBy
     * @returns {this}
     * @overload
     * @param {SDNode} dirtyBy 
     * @returns {this}
     * @overload
     * @returns {this}
     */
    dirty(dirtyBy) {
        if (dirtyBy === undefined)
            dirtyBy = Const.DirtyChannel.empty;
        if (typeof(dirtyBy) === "number") {
            if (this._.isDirty) return this;
            if (this._.dirtyByMe) return this;
            const dirtyChannel = dirtyBy;
            dirtyBy = this;
            this._.dirtyByMe |= dirtyChannel;
        } else {
            if (this._.enter) return this;
            this._.isDirty = dirtyBy;
            this._.dirtyByMe = 0;
        }
        this.children.dirty(dirtyBy);
        return this;
    }
    /**
     * 检测是否存在dirty标记，如果存在，完成更新
     */
    dirtyCheck(channel = 0) {
        if (this._.isDirty) {
            if (!global.dirtyCheckAndUpdate) {
                global.dirtyCheckAndUpdate = true;
                this._.isDirty.update();
                global.dirtyCheckAndUpdate = false;
                console.assert(this._.isDirty === undefined);
            }
        } else if (
            (this._.dirtyByMe & channel) &&             // 对应通道被弄脏了
            (channel !== Const.DirtyChannel.empty)) {   // 不是通配通道
            if (this._.enter) {
                this.update();
            } else if (!global.dirtyCheckAndUpdate) {
                global.dirtyCheckAndUpdate = true;
                this.update();
                global.dirtyCheckAndUpdate = false;
                console.assert(this._.isDirty === undefined);
            }
        }
        return this;
    }
}

let updateChain = [];