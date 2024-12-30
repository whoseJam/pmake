import { Context } from "@/Animate/Context";
import { Line } from "@/Node/Nake/Line";
import { Text } from "@/Node/Nake/Text";
import { Check } from "@/Utility/Check";

let ID = 0;
const pointerMap = {};

function MakePointer(pointer, direction, length) {
    if (direction === "t") pointer.source(0, 0).target(0, -length);
    if (direction === "b") pointer.source(0, 0).target(0, length);
    if (direction === "l") pointer.source(0, 0).target(-length, 0);
    if (direction === "r") pointer.source(0, 0).target(length, 0);
    pointer.arrow();
}

function PointerRule(parent, child) {
    const direction = child.vars.direction;
    const element = child.vars.pointAt;
    const gap = child.vars.pointerGap;
    if (!element) {
        child.opacity(0);
        return;
    }
    const pointers = pointerMap[element.id].filter(pointer => {
        return (
            pointer.vars.direction === direction &&
            (pointer.opacity() !== 0 || pointer === child)
        );
    });
    pointers.sort((a, b) => a.id - b.id);
    for (let i = 0; i < pointers.length; i++) {
        const k = (i + 1) / (pointers.length + 1);
        if (direction === "t")
            pointers[i].cx(element.kx(k)).y(element.my() + gap);
        if (direction === "b")
            pointers[i].cx(element.kx(k)).my(element.y() - gap);
        if (direction === "l")
            pointers[i].cy(element.ky(k)).x(element.mx() + gap);
        if (direction === "r")
            pointers[i].cy(element.ky(k)).mx(element.x() - gap);
    }
}

function LabelRule(direction, gap) {
    return function (parent, child) {
        if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
        if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
        if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
        if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    };
}

export function Pointer(
    parent,
    label,
    direction = "b",
    pointerGap = 10,
    length = 50,
    labelGap = 10,
) {
    const pointer = new Line(parent).opacity(0);
    MakePointer(pointer, direction, length);

    pointer.vars.merge({
        pointAt: undefined,
        priority: 1,
        direction: direction,
        pointerGap: pointerGap,
        labelGap: labelGap,
    });

    pointer.childAs(
        "label",
        new Text(pointer, label).fontSize(20),
        LabelRule(direction, labelGap),
    );

    pointer.moveTo = function (arg0, arg1) {
        const update = () => {
            const oldElement = this.vars.pointAt;
            if (oldElement)
                pointerMap[oldElement.id] = pointerMap[oldElement.id].filter(
                    p => p !== pointer,
                );
            if (arguments.length === 1) {
                if (Check.isFalseType(arg0)) {
                    this.vars.pointAt = undefined;
                } else {
                    this.vars.pointAt =
                        typeof arg0 === "object" ? arg0 : parent.element(arg0);
                }
            } else {
                this.vars.pointAt = parent.element(arg0, arg1);
            }
            const newElement = this.vars.pointAt;
            if (newElement) {
                if (!pointerMap[newElement.id]) pointerMap[newElement.id] = [];
                pointerMap[newElement.id].push(this);
            }

            if (
                oldElement &&
                oldElement !== newElement &&
                pointerMap[oldElement.id].length > 0
            ) {
                pointerMap[oldElement.id].forEach(pointer =>
                    pointer.startAnimate(this),
                );
                pointerMap[oldElement.id][0].triggerRule();
                pointerMap[oldElement.id].forEach(pointer =>
                    pointer.endAnimate(),
                );
            }
        };
        if (this.opacity() === 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            update();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else update();
        return this;
    };

    if (parent.childAs) parent.childAs(`pointer_${++ID}`, pointer, PointerRule);
    else pointer.rule(PointerRule);
    return pointer;
}
