import { SDNode } from "@/slide";
import { Context } from "../Animate/Context";
import { Line } from "../Node/Basic/Line";
import { Text } from "../Node/Basic/Text";

let id = 0;

function initPointer(pointer, direction, length) {
    if (direction === "t")      pointer.source(0, 0).target(0, -length);
    else if (direction === "b") pointer.source(0, 0).target(0, length);
    else if (direction === "l") pointer.source(0, 0).target(-length, 0);
    else if (direction === "r") pointer.source(0, 0).target(length, 0);
    else console.error(direction);
    pointer.arrow();
}

/**
 * 构造一个指针
 * @param {SDNode} node 
 * @param {string} label 
 * @param {"t"|"b"|"l"|"r"} direction
 * @param {number} gap 
 * @returns {SDNode} 指针
 */
export function Pointer(node, label, direction = "b", gap = 10, length = 50) {
    const pointer = new Line(node);
    const text = new Text(pointer, label).fontSize(20);
    let elem;
    initPointer(pointer, direction, length);

    const move = (self, target) => {
        if  (direction === "t")     self.cx(target.cx()).y(target.my() + gap);
        else if (direction === "b") self.cx(target.cx()).my(target.y() - gap);
        else if (direction === "l") self.cy(target.cy()).x(target.mx() + gap);
        else if (direction === "r") self.cy(target.cy()).mx(target.x() - gap);
    };

    // 指针的标签
    pointer.childAs(`label_${++id}`, text, (parent, child) => move(child, parent));

    // 指针的moveTo方法
    pointer.moveTo = function() {
        if (arguments.length === 1 && (arguments[0] === null || arguments[0] === undefined)) elem = undefined;
        else if (arguments.length === 1 && typeof(arguments[0]) === "object") elem = arguments[0];
        else elem = node.element.apply(node, arguments);

        let context = new Context(this);
        if (elem) {
            if (!this.opacity()) {
                context.till(0, 0);
                move(this, elem);
                context.till(0, 1);
                this.opacity(1);
            } else move(this, elem);
        } else this.opacity(0);
        context.recover();
        return this;
    }

    // 添加指针
    node.childAs(`pointer_${++id}`, pointer, (parent, child) => {
        if (elem) move(child, elem);
    });

    pointer.opacity(0);
    return pointer;
}