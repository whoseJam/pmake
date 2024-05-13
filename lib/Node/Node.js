import { Action } from "../Animate/Action";
import { Children } from "./Children";
import { Const } from "../Utility/Const";
import { d3ToNake } from "../Utility/Tool";
import { Interp } from "../Animate/Interp";
import { svg } from "../Interact/Svg";
import { equal } from "../Utility/Math";

let id = 0;

/**
 * @class SDNode
 * @description SDNode的基类
 */
export class SDNode {
    /**
     * @constructor
     * @param {SDNode} node 
     */
    constructor(node) {
        if (node === svg()) svg().children.push(this);
        let parentLayer = ("g" in node ? node.g() : node);
        this.parent = parentLayer.node;
        this.children = new Children(this);

        /** @type {SDNode} */
        this.isAttachTo = parentLayer.node;
        this._ = {
            parentLayer: parentLayer,
            nodeId: ++id,
            group: parentLayer.append("g"),
            animating: false,
            frame: -1,
            animateL: 0,
            animateR: 0,
            opacity: 1,
            dirtyBy: undefined,
            dirtyLevel: "",
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
        this._[`layer_${name}`] = layer;
        return layer;
    }

    /**
     * 把当前节点附加到node节点的图层中去
     * @param {SDNode} node
     */
    attachTo(node) {
        const attachToNode = ("g" in node) ? node : node.node;
        const parentLayer = ("g" in node) ? node.g() : node;
        const thisLayer = this.g();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.parentLayer,
            parentLayer,
            function(t, attr = true, firstCall, lastCall) {
                if (lastCall) {
                    Snap(d3ToNake(this.to)).append(
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
     * @param {(SDNode, SDNode) => void} rule
     * @returns {this}
     */
    childAs(name, child, rule) {
        child.dirtyCheck();
        this.children.push(name, child, rule);
        if (child.isAttachTo !== this) child.attachTo(this);
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
     * 
     */
    animateCheck() {
        if (this._.frame !== window.__FRAME__) {
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
        this.animateCheck();
        let l, r;
        if (arguments.length === 0) {
            l = this.delay();
            r = l + 300;
        } else if (arguments.length === 1) {   // startAnimate(duration = 300)
            if (typeof(other) === "number") {
                l = this.delay();
                r = l + other;
            } else {
                if (typeof(other._.animateL) !== "number" ||
                    typeof(other._.animateR) !== "number") throw new Error("Invalid Arguments");
                l = other._.animateL;
                r = other._.animateR;
            }
        } else {    // startAnimate(l = 300, r = 600)
            if (typeof(arguments[0]) !== "number" || typeof(arguments[1]) !== "number") throw new Error("Invalid Arguments");
            l = arguments[0];
            r = arguments[1];
        };
        if (this._.animateL != l || this._.animateR != r) this.dirtyCheck("sub");
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
        this.animateCheck();
        this.dirtyCheck();
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
        this.animateCheck();
        return this._.animating;
    }

    /**
     * 查询动画的延时
     * @returns {number} 动画的延时
     */
    delay() {
        this.animateCheck();
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
        this.animateCheck();
        this.dirtyCheck();
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
        this.animateCheck();
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
        this.dirtyCheck();
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
        this.dirtyCheck();
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this._.x = x;
        this.dirty(this, "U");
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
        this.dirtyCheck();
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this._.y = y;
        this.dirty(this, "U");
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
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this._.width = width;
        this.dirty(this, "U");
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
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this._.height = height;
        this.dirty(this, "U");
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
        this._.dirtyLevel = "";
        this._.dirtyBy = undefined;
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
     * @param {SDNode} dirtyBy
     * @param {"U"|"R"|"C"} dirtyLevel
     * @returns {this}
     */
    dirty(dirtyBy, dirtyLevel) {
        if (this._.dirtyBy) return this;
        this._.dirtyBy = dirtyBy;
        this._.dirtyLevel = dirtyLevel;
        this.children.dirty(dirtyBy, "U");
        return this;
    }

    /**
     * 检测是否存在dirty标记，如果存在，完成更新
     * @returns {this}
     */
    dirtyCheck(range = "cur") {
        if (range === "cur") {
            if (this._.dirtyLevel === "U") {
                if (!global.dirtyCheckAndUpdate) {
                    global.dirtyCheckAndUpdate = true;
                    this._.dirtyBy.update();
                    global.dirtyCheckAndUpdate = false;
                }
            }
        } else if (range === "sub") {
            if (this._.dirtyBy === this) {
                this.update();
            }
        }
        return this;
    }
}

let updateChain = [];