import { Action } from "../Animate/Action";
import { Children } from "./Children";
import { Const } from "../Utility/Const";
import { D3Helper } from "../Utility/D3Helper";
import { Interp } from "../Animate/Interp";
import { svg } from "../Interact/Svg";
import { equal } from "../Utility/Math";

function fresh(self) {
    if (self._.frame !== window.__FRAME__) {
        self._.frame = window.__FRAME__;
        self._.animateL = 0;
        self._.animateR = 0;
        self._.animating = false;
    }
}

let id = 0;

/**
 * @class Node
 * @description 提供了一个svg元素的基础属性
 */
export class Node {
    constructor(node) {
        if (node === svg())
            svg().children.push(this);
        const parentLayer = (typeof(node.g) === "function") ? node.g() : node;
        this.parent = node;
        this.children = Children(this);
        this.isAttachTo = parentLayer.node;
        this._ = {
            parentLayer: parentLayer,
            nodeId: ++id,
        };

        // 用于指导一个元素如何进入，退出另一个元素
        this._.group = parentLayer.append("g");
        this._.group.node = this;

        // 动画系统参数
        this._.animating = false;
        this._.frame = -1;
        this._.animateL = 0;
        this._.animateR = 0;

        // 透明度
        this._.opacity = 1;

        // 延迟更新
        this._.isDirty = undefined;
        this._.dirtyByMe = 0;
        
        new Action(0, 0, 0, 1, 
            Interp.numberInterp(this._.group, "opacity"),
            this, "opacity");
    }

    // --------------------图层系统--------------------
    /**
     * 获取当前节点的group
     */
    g() {
        return this._.group;
    }
    /**
     * 获取当前节点，名字为name的图层
     */
    layer(name) {
        return this._[`layer_${name}`];
    }
    /**
     * 在当前节点上，新建一个名为name的图层
     */
    newLayer(name) {
        let layer = this._.group.append("g");
        layer.attr(name, "");
        layer.node = this;
        this._["layer_" + name] = layer;
        return layer;
    }
    /**
     * 把当前节点附加到node节点的图层中去
     */
    attachTo(node) {
        const attachToNode = (typeof(node.g) === "function") ? node : node.node;
        const parentLayer = (typeof(node.g) === "function") ? node._.group : node;
        const thisLayer = this._.group;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.parentLayer,
            parentLayer,
            function(t, attr = true, firstCall, lastCall) {
                if (lastCall) {
                    console.log("attach action from=", this.from, "to=", this.to)
                    Snap(D3Helper.element(this.to)).append(
                        Snap(D3Helper.element(thisLayer))
                    );
                }
            }, this, "attach-to"
        );
        this._.parentLayer = parentLayer;
        this.isAttachTo = attachToNode;
    }

    /**
     * 插入一个名叫childName的，节点child到当前节点中，位置更新规则为rule
     * 
     * childAs会自动把child放置在当前节点的图层下
     * @param {string|number} childName 
     * @param {Node} child 
     * @param {*} rule
     * @returns 当前节点 
     */
    childAs(childName, child, rule) {
        this.children.push(childName, child, rule);
        if (child.isAttachTo !== this) child.attachTo(this);
        return this;
    }
    /**
     * 查询名为childName的子节点
     * @param {string|number} childName 
     * @returns {Node} 名为childName的子节点
     */
    child(childName) {
        return this.children.child(childName);
    }


    // --------------------动画系统--------------------
    /**
     * 开启一段动画
     * 
     * - startAnimate(400) 开启一段持续时长400ms的动画
     * 
     * - startAnimate(node) 以node为基础开启一段动画
     * 
     * - startAnimate(250, 600) 开启一段区间范围[250, 600]的动画
     * 
     * - startAnimate() 开启一段持续时长300ms的动画
     */
    startAnimate(other) {
        fresh(this);
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
     */
    endAnimate() {
        fresh(this);
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
     */
    isAnimating() {
        fresh(this);
        return this._.animating;
    }
    /**
     * 查询动画的延时
     * @returns {number} 动画的延时
     */
    delay() {
        fresh(this);
        return this._.animateL;
    }
    /**
     * 设置一段动画在某时间之后开始
     */
    after(other) {
        fresh(this);
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
        fresh(this);
        return this._.animateR - this._.animateL;
    }

    // --------------------杂项--------------------
    /**
     * 修改子树内所有节点的透明度
     * @param {number} opacity 目标透明度
     * @returns {Node} 当前节点
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
     * @param {Array} vec 向量，一个长度为2的数组
     * @returns {boolean} vec是否落在当前节点构成的矩形中
     */
    inRange(vec) {
        return this.x() <= vec[0] && vec[0] <= this.mx() &&
               this.y() <= vec[1] && vec[1] <= this.my();
    }
    remove() {
        this.opacity(0);
    }
    recover() {
        this.opacity(1);
    }


    // --------------------位置函数--------------------
    // 通用定位，返回一个点的坐标
    pos(xloc, yloc, dx = 0, dy = 0) {
        return [
            this[xloc]() + dx,
            this[yloc]() + dy
        ];
    }
    x(x) {
        this.dirtyCheck(Const.DirtyChannel.x);
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this._.x = x;
        this.dirty(Const.DirtyChannel.x);
        return this;
    }
    y(y) {
        this.dirtyCheck(Const.DirtyChannel.y);
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this._.y = y;
        this.dirty(Const.DirtyChannel.y);
        return this;
    }
    width(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this._.width = width;
        this.dirty(Const.DirtyChannel.width);
        return this;
    }
    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this._.height = height;
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    kx(k) {
        return this.x() + k * this.width();
    }
    ky(k) {
        return this.y() + k * this.height();
    }
    cx(cx) {
        if (cx === undefined) return this.x() + this.width() / 2;
        this.x(cx - this.width() / 2);
        return this;
    }
    cy(cy) {
        if (cy === undefined) return this.y() + this.height() / 2;
        this.y(cy - this.height() / 2);
        return this;
    }
    dx(d) {
        this.x(this.x() + d);
        return this;
    }
    dy(d) {
        this.y(this.y() + d);
        return this;
    }
    mx(mx) {
        if (mx === undefined) return this.x() + this.width();
        this.x(mx - this.width());
        return this;
    }
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
     */
    dirty(dirtyBy = Const.DirtyChannel.empty) {
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
            // console.log("this=", this, "isUpdating=", global.dirtyCheckAndUpdate);
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
            // this.update();
        }
        return this;
    }
}

let updateChain = [];