import { Context } from "@/Animate/Context";
import { Line } from "@/Node/Nake/Line";
import { Text } from "@/Node/Nake/Text";

let id = 0;

function initPointer(pointer, direction, length) {
    if (direction === "t")      pointer.source(0, 0).target(0, -length);
    else if (direction === "b") pointer.source(0, 0).target(0, length);
    else if (direction === "l") pointer.source(0, 0).target(-length, 0);
    else if (direction === "r") pointer.source(0, 0).target(length, 0);
    else console.error(direction);
    pointer.arrow();
}

export function Pointer(parent, label, direction = "b", gap = 10, length = 50) {
    const pointer = new Line(parent);
    const text    = new Text(pointer, label).fontSize(20);
    let element;
    initPointer(pointer, direction, length);

    const move = (self, target) => {
        if      (direction === "t") self.cx(target.cx()).y(target.my() + gap);
        else if (direction === "b") self.cx(target.cx()).my(target.y() - gap);
        else if (direction === "l") self.cy(target.cy()).x(target.mx() + gap);
        else if (direction === "r") self.cy(target.cy()).mx(target.x() - gap);
    };

    pointer.childAs(`label_${++id}`, text, (parent, child) => move(child, parent));

    pointer.moveTo = function(arg0, arg1) {
        if (arguments.length === 1) {
            element = typeof(arg0) === "object" ? arg0 :
                      arg0 === null || arg0 === undefined ? undefined : parent.element(arg0);
        } else if (arguments.length === 2) {
            element = parent.element(arg0, arg1);
        }

        const context = new Context(this);
        if (element) {
            if (!this.opacity()) {
                context.till(0, 0);
                move(this, element);
                context.till(0, 1);
                this.opacity(1);
            } else move(this, element);
        } else this.opacity(0);
        context.recover();
        return this;
    }

    if (parent.childAs) {
        parent.childAs(`pointer_${++id}`, pointer, (parent, child) => {
            if (element) move(child, element);
        });
    }

    pointer.opacity(0);
    return pointer;
}