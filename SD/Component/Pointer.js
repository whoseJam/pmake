import { Context } from "@/Animate/Context";
import { Line } from "@/Node/Nake/Line";
import { Text } from "@/Node/Nake/Text";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

let ID = 0;
const pointerMap = {};

function MakePointer(pointer, direction, length) {
    if (direction === "t") pointer.source(0, 0).target(0, -length);
    if (direction === "b") pointer.source(0, 0).target(0, length);
    if (direction === "l") pointer.source(0, 0).target(-length, 0);
    if (direction === "r") pointer.source(0, 0).target(length, 0);
    pointer.arrow();
}

function PointerRule(parent, pointer) {
    const element = pointer.vars.element;
    if (!element) return;
    const direction = pointer.direction();
    const gap = pointer.gap();
    const pointers = pointerMap[element.id].filter(p => p.direction() === direction && (p.opacity() !== 0 || p === pointer));
    pointers.sort((a, b) => a.id - b.id);
    for (let i = 0; i < pointers.length; i++) {
        const k = (i + 1) / (pointers.length + 1);
        if (direction === "t") pointers[i].cx(element.kx(k)).y(element.my() + gap);
        if (direction === "b") pointers[i].cx(element.kx(k)).my(element.y() - gap);
        if (direction === "l") pointers[i].cy(element.ky(k)).x(element.mx() + gap);
        if (direction === "r") pointers[i].cy(element.ky(k)).mx(element.x() - gap);
    }
}

function LabelRule(parent, label) {
    const direction = parent.direction();
    const gap = parent.gap();
    if (direction === "t") label.cx(parent.cx()).y(parent.my() + gap);
    if (direction === "b") label.cx(parent.cx()).my(parent.y() - gap);
    if (direction === "l") label.cy(parent.cy()).x(parent.mx() + gap);
    if (direction === "r") label.cy(parent.cy()).mx(parent.x() - gap);
}

export function Pointer(parent, label, direction = "b", gap = 10, length = 50) {
    const pointer = new Line(parent).opacity(0);
    MakePointer(pointer, direction, length);

    pointer.vars.merge({
        element: undefined,
        priority: 1,
        direction: direction,
        gap: gap,
    });

    pointer.direction = Factory.handler("direction");
    pointer.gap = Factory.handler("gap");

    pointer.childAs("label", new Text(pointer, label).fontSize(20), LabelRule);

    pointer.moveTo = function (arg0, arg1) {
        const args = arguments;
        const update = () => {
            this.vars.freeze();
            const element1 = this.vars.element;
            if (element1) pointerMap[element1.id] = pointerMap[element1.id].filter(p => p !== pointer);
            switch (args.length) {
                case 1:
                    if (Check.isFalseType(arg0)) this.vars.element = undefined;
                    else this.vars.element = Check.isTypeOfSDNode(arg0) ? arg0 : parent.element(arg0);
                    break;
                case 2:
                    this.vars.element = parent.element(arg0, arg1);
            }
            const element2 = this.vars.element;
            if (element2) {
                if (!pointerMap[element2.id]) pointerMap[element2.id] = [];
                pointerMap[element2.id].push(this);
            }
            this.vars.unfreeze();
        };
        if (Check.isFalseType(arg0)) {
            this.vars.element = undefined;
            this.opacity(0);
            return this;
        }
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
