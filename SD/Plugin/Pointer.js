import { Context } from "@/Animate/Context";
import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

const DIRECTION_KEY = new Set(["l", "r", "t", "b"]);
const DIRECTION_KEY_SUGGESTION = [() => true, "For pointer component, here are 4 types of directions which are 'l', 'r', 't', 'b'."];
const pointerMap = {};

class PointerPlugin {
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        value = Cast.castToSDNode(this, value);
        this.childAs("value", value, rule || labelRule);
        return this;
    }
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule || labelRule);
        return this;
    }
    gap(gap) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap, "PointerPlugin.gap");
        this.vars.lpset("gap", gap);
        return this;
    }
    valueGap(gap) {
        if (arguments.length === 0) return this.vars.valueGap;
        Check.validateNumber(gap, "PointerPlugin.valueGap");
        this.vars.lpset("valueGap", gap);
        return this;
    }
    pointerGap(gap) {
        if (arguments.length === 0) return this.vars.pointerGap;
        Check.validateNumber(gap, "PointerPlugin.pointerGap");
        this.vars.lpset("pointerGap", gap);
        return this;
    }
    length(length) {
        if (arguments.length === 0) return this.vars.length;
        Check.validateNumber(length, "PointerPlugin.length");
        this.vars.lpset("length", length);
        return this;
    }
    direction(direction) {
        if (arguments.length === 0) return this.vars.direction;
        Check.validateDirection(direction, DIRECTION_KEY, "PointerPlugin.direction", 1, DIRECTION_KEY_SUGGESTION);
        this.vars.direction = direction;
        return this;
    }
    moveTo(x, y) {
        if (Check.isEmpty(x)) {
            erasePointerMap(this);
            this.vars.element = undefined;
            return this.opacity(0);
        }
        if (arguments.length === 2) return this.moveTo(this.vars.target.element(x, y));
        else if (arguments.length === 1 && !(x instanceof SDNode)) return this.moveTo(this.vars.target.element(x));
        erasePointerMap(this);
        if (this.duration() > 0 && this.opacity() === 0) {
            const context = new Context(this);
            context.till(0, 0);
            addPointerMap(this, x);
            this.vars.element = x;
            context.till(0, 1);
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            addPointerMap(this, x);
            this.vars.element = x;
        }
        return this;
    }
    pointElement() {
        return this.vars.element;
    }
}

export function Pointer(target, text = "", direction = "b", pointerGap = 3, length = 20, valueGap = 3) {
    const self = new Line(target).opacity(0).arrow();

    self.vars.merge({
        target,
        element: undefined,
        length,
        direction,
        pointerGap,
        valueGap,
        gap: 10,
    });

    self.value = PointerPlugin.prototype.value;
    self.valueFromExist = PointerPlugin.prototype.valueFromExist;
    self.valueGap = PointerPlugin.prototype.valueGap;
    self.pointerGap = PointerPlugin.prototype.pointerGap;
    self.direction = PointerPlugin.prototype.direction;
    self.length = PointerPlugin.prototype.length;
    self.moveTo = PointerPlugin.prototype.moveTo;
    self.pointElement = PointerPlugin.prototype.pointElement;
    self.gap = PointerPlugin.prototype.gap;

    self.effect("pointer", () => {
        const element = self.vars.element;
        if (!element) return;
        const direction = self.direction();
        const pointers = pointerMap[element.id].filter(p => p.direction() === direction && (p.opacity() !== 0 || p === self));
        pointers.sort((a, b) => a.id - b.id);
        const elementlength = getLength(element, direction);
        const gapLength = getGapLength(pointers);
        function layout(pointer, x, y) {
            const gap = pointer.gap();
            const length = pointer.length();
            if (direction === "t") pointer.source(x, y + gap + length).target(x, y + gap);
            if (direction === "b") pointer.source(x, y - gap - length).target(x, y - gap);
            if (direction === "r") pointer.source(x - gap - length, y).target(x - gap, y);
            if (direction === "l") pointer.source(x + gap + length, y).target(x + gap, y);
        }
        if (gapLength <= elementlength) {
            pointers.forEach((pointer, i) => {
                const k = (i + 1) / (pointers.length + 1);
                let x;
                let y;
                if (direction === "t" || direction === "b") {
                    x = element.kx(k);
                    if (direction === "t") y = element.my();
                    if (direction === "b") y = element.y();
                } else {
                    if (direction === "l") x = element.mx();
                    if (direction === "r") x = element.x();
                    y = element.ky(k);
                }
                layout(pointer, x, y);
            });
        } else {
            let current = 0;
            pointers.forEach((pointer, i) => {
                if (i >= 1) current += Math.max(pointers[i - 1].gap(), pointer.gap());
                let x;
                let y;
                if (direction === "t" || direction === "b") {
                    x = element.cx() + (current - gapLength / 2);
                    if (direction === "t") y = element.my();
                    if (direction === "b") y = element.y();
                } else {
                    if (direction === "l") x = element.mx();
                    if (direction === "r") x = element.x();
                    y = element.cy() + (current - gapLength / 2);
                }
                layout(pointer, x, y);
            });
        }
    });

    if (target instanceof SDNode) target.childAs(self);

    self.value(text);

    return self;
}

function getLength(element, direction) {
    if (direction === "t" || direction === "b") return element.width();
    return element.height();
}

function getGapLength(pointers) {
    let length = 0;
    for (let i = 1; i < pointers.length; i++) length += Math.max(pointers[i - 1].gap(), pointers[i].gap());
    return length;
}

function labelRule(parent, child) {
    const gap = parent.valueGap();
    const direction = parent.direction();
    if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
    if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
    if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
}

function addPointerMap(pointer, element) {
    if (!pointerMap[element.id]) pointerMap[element.id] = [];
    pointerMap[element.id].push(pointer);
}

function erasePointerMap(pointer) {
    const element = pointer.vars.element;
    if (!element) return;
    pointerMap[element.id] = pointerMap[element.id].filter(p => p !== pointer);
    if (pointerMap[element.id].length >= 1) pointerMap[element.id][0].triggerEffect("pointer");
}
