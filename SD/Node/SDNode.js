import { Animate } from "@/Node/Core/Animate";
import { Children } from "@/Node/Core/Children";
import { Enter as EN } from "@/Node/Core/Enter";
import { Interact } from "@/Node/Core/Interact";
import { effect, reactive, uneffect } from "@/Node/Core/Reactive";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

let id = 0;

export function getTargetLayer(target) {
    if (target instanceof SDNode) return target.layer();
    return target;
}

function interp(node) {
    return function (object, key = "opacity") {
        return function (t) {
            const k = this.source + (this.target - this.source) * t;
            object.setAttribute(key, k);
            if (t === 1 && !node._.clickableCalled) {
                object.setAttribute("pointer-events", k === 0 ? "none" : "auto");
            }
        };
    };
}

export class SDNode {
    constructor(target) {
        this.id = ++id;
        this._ = {
            ready: false, // only when ready = true, the action can impact the node
            layer: undefined,
            layers: {},
            parent: undefined,
            animate: new Animate(this),
            children: new Children(this),
            interact: new Interact(this),
            updaters: {},
            freezing: 0,
        };

        this._.layers.__targetLayer = getTargetLayer(target);
        this._.layer = RenderNode.createRenderNode(this, this._.layers.__targetLayer, "g");

        this.vars = reactive({
            opacity: 1,
        });

        this.vars.watch("opacity", Factory.action(this, this._.layer, "opacity", interp(this)));
    }
    static extend(clazz) {
        if (!this.__parentClass) this.__parentClass = [];
        this.__parentClass.push(clazz);
    }
    static [Symbol.hasInstance](object) {
        if (!object) return false;
        let flag = false;
        const visited = new Set();
        const dfs = currentProto => {
            if (currentProto === null) return;
            if (visited.has(currentProto)) return;
            if (currentProto === this.prototype) flag = true;
            if (flag) return;
            visited.add(currentProto);
            if (currentProto.constructor.__parentClass) {
                currentProto.constructor.__parentClass.forEach(clazz => {
                    if (flag) return;
                    dfs(clazz.prototype);
                    if (flag) return;
                });
            }
            if (flag) return;
            dfs(Object.getPrototypeOf(currentProto));
        };
        dfs(Object.getPrototypeOf(object));
        return flag;
    }
}

function forward(comp, func) {
    return function () {
        const component = this._[comp];
        component[func].apply(component, arguments);
        return this;
    };
}

function forwardWithReturn(comp, func) {
    return function () {
        const component = this._[comp];
        return component[func].apply(component, arguments);
    };
}

Object.assign(SDNode.prototype, {
    type(type) {
        if (type === undefined) return this._.layer.getAttribute("type");
        this._.layer.setAttribute("type", type);
        return this;
    },
    fixAspect() {
        return false;
    },

    layer(name) {
        return name === undefined ? this._.layer : this._.layers[name];
    },
    newLayer() {
        ErrorLauncher.notImplementedYet("newLayer", `${this.constructor.name}.newLayer`);
    },
    attachTo(target) {
        if (target instanceof SDNode) this._.layer.moveTo(target.layer());
        else this._.layer.moveTo(target);
        return this;
    },

    childAs() {
        const args = [...arguments];
        const child = args.filter(arg => arg instanceof SDNode)[0];
        const rule = args.filter(arg => typeof arg === "function")[0];
        const update = () => {
            if (child._.parent !== this && !child.onEnter()) child.attachTo(this);
            this._.children.push(args[0], args[1], args[2]);
        };
        if (!child.onEnter()) child.onEnter(EN.appear());
        if (rule) this.tryUpdate(child, update);
        else update();
        return this;
    },
    child: forwardWithReturn("children", "child"),
    hasChild: forwardWithReturn("children", "has"),
    eraseChild: forwardWithReturn("children", "erase"),
    remove() {
        this._.layer.remove();
    },

    startAnimate: forward("animate", "startAnimate"),
    endAnimate: forward("animate", "endAnimate"),
    delay: forwardWithReturn("animate", "delay"),
    after: forward("animate", "after"),
    duration: forwardWithReturn("animate", "duration"),

    freeze() {
        this._.freezing++;
        for (const key in this._.updaters) this._.updaters[key].freeze();
        // this.vars.freeze();
        return this;
    },
    unfreeze() {
        this._.freezing--;
        for (const key in this._.updaters) this._.updaters[key].unfreeze();
        // this.vars.unfreeze();
        return this;
    },
    freezing() {
        return this._.freezing > 0;
    },
    rule(rule) {
        if (rule === undefined) return this._.rule;
        this._.rule = effect(() => {
            rule(this._.parent, this);
        }, this.type() + "-rule");
        return this;
    },
    eraseRule() {
        if (!this.rule()) return this;
        uneffect(this._.rule);
        this._.rule = undefined;
        return this;
    },
    effect(name, callback) {
        if (arguments.length === 1) return this._.updaters[name];
        this._.updaters[name] = effect(callback);
        return this;
    },
    uneffect(name) {
        uneffect(this._.updaters[name]);
        delete this._.updaters[name];
        return this;
    },
    uneffectAll() {
        for (const name in this._.updaters) this.uneffect(name);
        return this;
    },
    triggerEffect(name) {
        this._.updaters[name].trigger();
        return this;
    },
    hasEffect(name) {
        return this._.updaters[name] !== undefined;
    },

    drag: forward("interact", "drag"),
    clickable(type) {
        this._.layer.setAttribute("pointer-events", Check.isFalse(type) ? "none" : "auto");
        this._.clickableCalled = true;
        return this;
    },
    click: forward("interact", "click"),
    onClick: forward("interact", "onClick"),
    dblClick: forward("interact", "dblClick"),
    onDblClick: forward("interact", "onDblClick"),
    onChange: forward("interact", "onChange"),

    onEnter(enter) {
        if (arguments.length === 0) return this._.enter;
        this._.enter = enter;
        return this;
    },
    onEnterDefault(enter) {
        if (!this._.enter) this._.enter = enter;
        return this;
    },
    triggerEnter(parent, move) {
        if (!this._.enter) return this;
        this._.entering = true;
        this._.enter.call(parent, this, move);
        this._.entering = this._.enter = undefined;
        return this;
    },
    entering() {
        return this._.entering !== undefined;
    },
    onExit(exit) {
        if (arguments.length === 0) return this._.exit;
        this._.exit = exit;
        return this;
    },
    onExitDefault(exit) {
        if (!this._.exit) this._.exit = exit;
        return this;
    },
    triggerExit() {
        if (!this._.exit) return this;
        this._.exit.call(this._.parent, this);
        this._.exit = undefined;
        return this;
    },
    tryUpdate(element, update) {
        if (element.onEnter()) {
            element.triggerEnter(this, update);
        } else update();
    },

    newLayer(name) {
        let layer = undefined;
        if (this._.layer instanceof HTMLNode) {
            layer = new HTMLNode(this, this._.layer, "div");
        } else {
            layer = new SVGNode(this, this._.layer, "g");
        }
        this._.layers[name] = layer;
        layer.setAttribute("layer", name);
        return this;
    },
    opacity(opacity) {
        if (arguments.length === 0) return this.vars.opacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.opacity`);
        this.vars.mpset("opacity", opacity);
        return this;
    },
    inRange(point) {
        return this.x() <= point[0] && point[0] <= this.mx() && this.y() <= point[1] && point[1] <= this.my();
    },
    x() {
        ErrorLauncher.notImplementedYet("x", this.type());
    },
    y() {
        ErrorLauncher.notImplementedYet("y", this.type());
    },
    width() {
        ErrorLauncher.notImplementedYet("width", this.type());
    },
    height() {
        ErrorLauncher.notImplementedYet("height", this.type());
    },
    scale(scale) {
        if (this.fixAspect()) {
            this.width(this.width() * scale);
        } else {
            this.freeze();
            this.width(this.width() * scale);
            this.height(this.height() * scale);
            this.unfreeze();
        }
        return this;
    },
    pos(x, y, dx = 0, dy = 0) {
        if (typeof x === "number" && typeof y === "number") return this.freeze().x(x).y(y).unfreeze();
        if (Array.isArray(x)) return this.pos(x[0], x[1]);
        return [
            // vector 2
            this[x]() + dx,
            this[y]() + dy,
        ];
    },
    center(cx, cy) {
        if (arguments.length === 0) {
            return this.pos("cx", "cy");
        } else if (arguments.length === 1) {
            return this.center(cx[0], cx[1]);
        }
        this.freeze();
        this.cx(cx).cy(cy);
        this.unfreeze();
        return this;
    },
    kx(k) {
        return this.x() + this.width() * k;
    },
    ky(k) {
        return this.y() + this.height() * k;
    },
    dx(dx) {
        return this.x(this.x() + dx);
    },
    dy(dy) {
        return this.y(this.y() + dy);
    },
    cx(cx) {
        if (cx === undefined) return this.kx(0.5);
        return this.x(cx - this.width() * 0.5);
    },
    cy(cy) {
        if (cy === undefined) return this.ky(0.5);
        return this.y(cy - this.height() * 0.5);
    },
    mx(mx) {
        if (mx === undefined) return this.kx(1);
        return this.x(mx - this.width());
    },
    my(my) {
        if (my === undefined) return this.ky(1);
        return this.y(my - this.height());
    },
    boundingBox(box) {
        if (arguments.length === 0) {
            return {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
            };
        }
        if (arguments.length === 4)
            return this.boundingBox({
                x: arguments[0],
                y: arguments[1],
                width: arguments[2],
                height: arguments[3],
            });
        this.freeze();
        this.width(box.width);
        this.height(box.height);
        this.x(box.x).y(box.y);
        this.unfreeze();
        return this;
    },
});

SDNode.prototype.position = SDNode.prototype.pos;
