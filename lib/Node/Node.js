import { Creator } from "../Animate/Action";
import { Interp } from "../Animate/Interp";
import { D3Helper } from "../Utility/D3Helper";
import { equal } from "../Utility/Math";
import { Action } from "../slide";

function fresh(self) {
    if (self._.frame !== window.__FRAME__) {
        self._.frame = window.__FRAME__;
        self._.tick = 0;
        self._.animating = false;
        self._.duration = 0;
    }
}

let id = 0;

function pushChild() {
    let childId, pos = 0, rule = undefined;
    if (typeof(arguments[pos]) === "number" ||
        typeof(arguments[pos]) === "string") {
        childId = arguments[pos++];
    } else childId = ++id;
    let child = arguments[pos++];
    if (arguments[pos] !== undefined)
        rule = arguments[pos++];
    child.parent = null;
    child.parent = this;
    this.children[childId] = child;
    if (rule) { child.rule = rule; rule(this.node, child); }
    return childId;
}

function eraseChild(child) {
    let children = this.children;
    if (typeof(child) === "object") {
        for (let id in children) {
            if (children[id] === child) {
                delete children[id];
            }
        }
        return child;
    } else {
        let ans = children[child];
        delete children[child];
        return ans;
    }
}

function removeChild(child) {
    child = this.erase(child);
    if (child) child.remove();
}

function getChild(childId) {
    return this.children[childId];
}

function updateChild() {
    let children = this.children;
    for (let id in children) {
        let child = children[id];
        let rule = child.rule;
        child.parent = null;
        if (typeof(rule) === "function") {
            rule(this.node, child);
        }
        if (child.isDirty) {
            child.update();
        }
        child.parent = this;
    }
}

function iterateChildren(callback) {
    let children = this.children;
    for (let id in children) {
        callback(children[id]);
    }
}

const LIVE = 1;
const DEAD = 2;

/**
 * @class Node
 * @description 提供了一个svg元素的基础属性
 */
export class Node {
    constructor(parent) {
        this.isDirty = false;
        this.parent = parent;
        let group = (typeof(parent.g) === "function") ? parent.g() : parent;
        this.children = {
            node: this,
            children: {},
            child: getChild,
            forEach: iterateChildren,
            push: pushChild,
            erase: eraseChild,
            remove: removeChild,
            update: updateChild
        }
        this._ = {};
        this._.group = group.append("g");
        this._.animating = false;
        this._.frame = -1;
        this._.tick = 0;
        this._.duration = 0;
        this._.nodeOpacity = 1;
        
        new Creator(this);
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
        this._["layer_" + name] = layer;
        return layer;
    }
    
    /**
     * 把当前节点附加到node节点的图层中去
     * @param {Node} node 
     */
    attachTo(node) {
        let parent = (typeof(node.g) === "function") ? node._.group : node;
        Snap(D3Helper.element(parent)).append(
            Snap(D3Helper.element(this._.group))
        );
    }

    /**
     * 标记从当前节点的位置发生了意料之外的更新
     * 
     * 从当前节点到svg树根的这条路径上的每个节点的update都需要被调用
     */
    dirty() {
        let cur = this;
        let prt = this.parent;
        while (prt) {
            cur = prt;
            cur.isDirty = true;
            prt = cur.parent;
        }
    }

    /**
     * 插入一个名叫childName的，节点child到当前节点中，位置更新规则为rule
     * @param {string|number} childName 
     * @param {Node} child 
     * @param {*} rule
     * @returns 当前节点 
     */
    childAs(childName, child, rule) {
        this.children.push(childName, child, rule);
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
     * 删除名字/引用为child的子节点
     * @param {Node|string|number} child
     */
    eraseChild(child) {
        this.children.erase(child);
        return this;
    }

    /**
     * 遍历每个子节点，并调用callback作用于该儿子
     * @param {*} callback
     * @returns 
     */
    forEachChild(callback) {
        return this.children.forEach(callback);
    }

    /**
     * 开启一段动画
     * @param {number|Node} other 如果other是number，则代表一段动画的持续时间；如果other是Node，则代表让当前节点的动画状态与other这个节点的动画状态同步 
     * @returns {Node} 当前节点
     */
    startAnimate(other = 300) {
        fresh(this);
        let animating = this._.animating;
        if ((other === undefined || typeof(other) === "number") && animating)
            throw new Error("在一个对象上连续多次startAnimate，你应该检查是否有地方遗漏了endAnimate");
        if (typeof(other.isAnimating) === "function") {
            if (animating && other.isAnimating())
                throw new Error("在一个对象上连续多次startAnimate，你应该检查是否有地方遗漏了endAnimate");
        }

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
            child.startAnimate(this);
        })
        return this;
    }

    /**
     * 结束一段动画
     * @returns {Node} 当前节点
     */
    endAnimate() {
        if (this.isAnimating()) {
            let tick = this._.tick;
            let dur = this._.duration;
            this._.tick = tick + dur;
            this._.animating = false;
            this._.duration = 0;
        }
        this.children.forEach((child) => {
            child.endAnimate();
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
        let tick;
        if (typeof(other) === "number") tick = other;
        else tick = other.delay();
        this._.tick = tick;
        this.children.forEach((child) => {
            child.after(this);
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
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.nodeOpacity, opacity,
            Interp.numberInterp(this._.group, "opacity"),
            this, "node-opacity"
        );
        this._.nodeOpacity = opacity;
        return this;
    }

    /**
     * 进行函数的转发，将函数参数原封不动地转交给某个子节点
     * @param {string} child
     * @param {string} funcname 转发的函数名
     * @param {Array} args 参数列表
     * @returns 如果此函数是返回this类型的函数，则返回父节点的this；否则返回子节点函数调用后，对应的返回值
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
        // if (this.parent && 
        //     this.parent.children) {
        //     console.log(this.parent);
        //     console.log(this.parent.children);
        //     console.log(this.parent.children.erase);
        //     this.parent.children.erase(this);
        // }
    }

    recover() {
        this.opacity(1);
    }

    x(x) {
        let ox = this._.x;
        if (x === undefined)
            return ox;
        if (equal(x, ox)) return this;
        this.dirty();
        this._.x = x;
        if (this.isDirty) this.update();
        else {
            this.children.forEach(function(child) {
                child.parent = null;
                child.dx(x - ox);
                child.parent = this;
            });
        }
        return this;
    }

    y(y) {
        let oy = this._.y;
        if (y === undefined)
            return oy;
        if (equal(y, oy)) return this;
        this.dirty();
        this._.y = y;
        if (this.isDirty) this.update();
        else {
            this.children.forEach(function(child) {
                child.parent = null;
                child.dy(y - oy);
                child.parent = this;
            })
        }
        return this;
    }

    width(width) {
        let ow = this._.width;
        if (width === undefined)
            return ow;
        if (equal(width, ow)) return this;
        this._.width = width;
        this.update();
        return this;
    }

    height(height) {
        let oh = this._.height;
        if (height === undefined)
            return oh;
        if (equal(height, oh)) return this;
        this._.height = height;
        this.update();
        return this;
    }

    cx(cx) {
        if (cx === undefined)
            return this.x() + this.width() / 2;
        this.x(this.x() + cx - this.cx());
        return this;
    }

    cy(cy) {
        if (cy === undefined)
            return this.y() + this.height() / 2;
        this.y(this.y() + cy - this.cy());
        return this;
    }
    
    dx(d) {
        console.log("this.x=", this.x(), "d=", d);
        this.x(this.x() + d);
        return this;
    }
    
    dy(d) {
        this.y(this.y() + d);
        return this;
    }
    
    mx(mx) {
        if (mx === undefined)
            return this.x() + this.width();
        this.x(this.x() + mx - this.mx());
        return this;
    }
    
    my(my) {
        if (my === undefined)
            return this.y() + this.height();
        this.y(this.y() + my - this.my());
        return this;
    }

    /**
     * 标记该节点的dirty标记为false，并遍历那些dirty标记为true的节点，依次完成update操作
     */
    update() {
        this.isDirty = false;
        this.children.update();
    }
}