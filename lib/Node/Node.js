import { Interp } from "../Animate/Interp";
import { D3Helper } from "../Utility/D3Helper";
import { equal } from "../Utility/Math";
import { Action, Curve } from "../slide";
import { Children } from "./Children";
import { svg } from "../Interact/Svg";

function fresh(self) {
    if (self._.frame !== window.__FRAME__) {
        self._.frame = window.__FRAME__;
        self._.tick = 0;
        self._.animating = false;
        self._.duration = 0;
    }
}

/**
 * @class Node
 * @description 提供了一个svg元素的基础属性
 */
export class Node {
    constructor(parent) {
        if (parent === svg())
            svg().children.push(this);
        this.parent = parent;
        let group = (typeof(parent.g) === "function") ? parent.g() : parent;
        this.isAttachTo = group.belong;
        this.children = Children(this);

        // 用于指导一个元素如何进入，退出另一个元素
        this.events = {};
        this._ = {};
        this._.group = group.append("g");
        this._.group.belong = this;
        this._.animating = false;
        this._.frame = -1;
        this._.tick = 0;
        this._.duration = 0;
        this._.nodeOpacity = 1;
        this._.opacity = 1;
        
        new Action(0, 0, 0, 1, 
            Interp.numberInterp(this._.group, "opacity"),
            this, "opacity");
    }

    /**
     * 获取当前节点的group
     * @returns {group}
     */
    g() {
        return this._.group;
    }

    /**
     * 获取当前节点，名字为name的图层
     * @param {string} name 
     * @returns {group}
     */
    layer(name) {
        return this._[`layer_${name}`];
    }

    /**
     * 在当前节点上，新建一个名为name的图层
     * @param {string} name 
     * @returns {group} 新建好的图层
     */
    newLayer(name) {
        let layer = this._.group.append("g");
        layer.attr(name, "");
        layer.belong = this;
        this._["layer_" + name] = layer;
        return layer;
    }
    
    /**
     * 把当前节点附加到node节点的图层中去
     * @param {Node} node 
     */
    attachTo(node) {
        if (typeof(node.g) === "function") this.isAttachTo = node;
        else this.isAttachTo = node.belong;
        let parent = (typeof(node.g) === "function") ? node._.group : node;
        Snap(D3Helper.element(parent)).append(
            Snap(D3Helper.element(this._.group))
        );
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

    /**
     * 开启一段动画
     * 
     * @param {number|Node} other 如果other是number，则代表一段动画的持续时间；
     * 如果other是Node，则代表让当前节点的动画状态与other这个节点的动画状态同步 
     * 
     * @returns {Node} 当前节点
     */
    startAnimate(other = 300, update = true) {
        if (update) this.update();
        fresh(this);
        let animating = this._.animating;
        let animatingAgain = false;
        if (other === undefined || typeof(other) === "number")
            animatingAgain = true;
        if (typeof(other.isAnimating) === "function" && other.isAnimating())
            animatingAgain = true;
        console.assert(
            !(animating && animatingAgain),
            "too many startAnimate()");

        let start = this.delay(), duration = other;
        if (typeof(other) === "object") {
            start = other.delay();
            duration = other.duration();
            animating = other.isAnimating();
        } else animating = true;

        this._.tick = start;
        this._.animating = animating;
        this._.duration = duration;

        this.children.forEach((child) => {
            child.startAnimate(this, false);
        });
        return this;
    }

    /**
     * 结束一段动画
     * @returns {Node} 当前节点
     */
    endAnimate(update = true) {
        if (update) this.update();
        if (this.isAnimating()) {
            let tick = this._.tick;
            let dur = this._.duration;
            this._.tick = tick + dur;
            this._.animating = false;
            this._.duration = 0;
        }
        this.children.forEach(function(child) {
            child.endAnimate(false);
        });
        return this;
    }

    /**
     * 查询节点是否正处于动画状态中
     * @returns {boolean} 是否在动画状态中
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
        return this._.tick;
    }

    /**
     * 表示一段动画在某时间之后/某对象动画状态结束之后开始（认为other是不在动画状态中的）
     * @param {number|Node} other 
     * @returns {Node} 当前节点
     */
    after(other) {
        fresh(this);
        let tick, parent = this;
        if (typeof(other) === "number") tick = other;
        else tick = other.delay();
        this._.tick = tick;
        this.children.forEach(function(child) {
            child.after(parent);
        });
        return this;
    }
    
    /**
     * 查询动画持续的时间
     * @returns {number} 动画持续时间
     */
    duration() {
        fresh(this);
        return this._.duration;
    }

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
     * 进行函数的转发，将函数参数原封不动地转交给某个子节点
     */
    dispatch(child, funcname, args) {
        child = this.children.child(child);
        let ans = child[funcname].apply(child, args);
        if (ans === child) return this;
        return ans;
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

    /**
     * 获取当前节点的某个位置
     * @param {"x"|"cx"|"mx"} xloc 
     * @param {"y"|"cy"|"my"} yloc 
     * @param {number} dx 
     * @param {number} dy 
     * @returns position of this node
     */
    pos(xloc, yloc, dx=0, dy=0) {
        return [
            this[xloc]() + dx,
            this[yloc]() + dy
        ];
    }

    x(x) {
        if (x === undefined) return this._.x;
        this._.x = x;
        return this;
    }

    y(y) {
        if (y === undefined) return this._.y;
        this._.y = y;
        return this;
    }

    width(width) {
        if (width === undefined) return this._.width;
        this._.width = width;
        return this;
    }

    height(height) {
        if (height === undefined) return this._.height;
        this._.height = height;
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
        this.x(this.x() + cx - this.cx());
        return this;
    }

    cy(cy) {
        if (cy === undefined) return this.y() + this.height() / 2;
        this.y(this.y() + cy - this.cy());
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
        this.x(this.x() + mx - this.mx());
        return this;
    }
    
    my(my) {
        if (my === undefined) return this.y() + this.height();
        this.y(this.y() + my - this.my());
        return this;
    }

    update() {
        this.children.update();
        return this;
    }
}