import { Context } from "@/Animate/Context";

import { Line } from "@/Node/Nake/Line";
import { Text } from "@/Node/Nake/Text";

let id = 0;

function MakePointer(pointer, direction, length) {
    if (direction === "t") pointer.source(0, 0).target(0, -length);
    if (direction === "b") pointer.source(0, 0).target(0, length);
    if (direction === "l") pointer.source(0, 0).target(-length, 0);
    if (direction === "r") pointer.source(0, 0).target(length, 0);
    pointer.arrow();
}

function MoveToFunction() {
    return function(arg0, arg1) {
        if (arguments.length === 1) {
            if (typeof(arg0) === "object") this.targetElement = arg0;
            else if (arg0 === null || arg0 === undefined) this.targetElement = undefined;
            else this.targetElement = this.parent.element(arg0);
        } else if (arguments.length === 2) {
            this.targetElement = this.parent.element(arg0, arg1);
        }

        const context = new Context(this);
        const rule = this._.rule; //this.rule();
        if (this.targetElement) {
            this.pointAt = this.targetElement.id;
            if (!this.opacity()) {
                context.till(0, 0);
                rule(this.parent, this);
                context.till(0, 1);
                this.opacity(1);
            } else rule(this.parent, this);
        } else {
            this.pointAt = 0;
            this.opacity(0);
        }
        context.recover();
        return this;
    }
}

function PointerMoveFunction(direction, gap) {
    return function(parent, child) {
        let count = 0;
        let front = 0;
        parent.children.forEach((other, name) => {
            if (!name.startsWith("pointer_")) return;
            if (other.pointAt === child.pointAt &&
                other.direction === child.direction &&
                other.opacity() !== 0) {
                count++;
                if (other.id < child.id) front++;
            }
        });
        const k = (front + 1) / (count + 1);
        const element = child.targetElement;
        if (!element) return;
        if (direction === "t") child.cx(element.kx(k)).y(element.my() + gap);
        if (direction === "b") child.cx(element.kx(k)).my(element.y() - gap);
        if (direction === "l") child.cy(element.ky(k)).x(element.mx() + gap);
        if (direction === "r") child.cy(element.ky(k)).mx(element.x() - gap);
    }
}

function LabelMoveFunction(direction, gap) {
    return function(parent, child) {
        if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
        if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
        if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
        if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    }
}

export function Pointer(parent, label, direction = "b", pointerGap = 10, length = 50, textGap = 10) {
    const pointer = new Line(parent);
    const text    = new Text(pointer, label).fontSize(20);
    MakePointer(pointer, direction, length);

    pointer.childAs("label", text, LabelMoveFunction(direction, textGap));

    pointer.moveTo = MoveToFunction();

    if (parent.childAs) {
        parent.childAs(`pointer_${++id}`, pointer, PointerMoveFunction(direction, pointerGap));
    }

    pointer.priority = 1;
    pointer.opacity(0);
    return pointer;
}