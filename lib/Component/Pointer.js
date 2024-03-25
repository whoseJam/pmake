import { Line, Text } from "../slide";

let id = 0;

/**
 * 构造一个指针
 * @param {Node} node 
 * @param {string} label 
 * @param {"t"|"b"|"l"|"r"} direction
 * @param {number} gap 
 * @returns {Node} 指针
 */
export function Pointer(node, label, direction="b", gap=10, length=50) {
    let pointer = new Line(node);
    let text = new Text(pointer, label).fontSize(20);
    let elemCache;
    if (direction === "t") pointer.source(0, 0).target(0, -length);
    else if (direction === "b") pointer.source(0, 0).target(0, length);
    else if (direction === "l") pointer.source(0, 0).target(-length, 0);
    else if (direction === "r") pointer.source(0, 0).target(length, 0);
    else throw new Error(`direction(${direction})不合法`);
    pointer.arrow();
    pointer.childAs(`label${++id}`, text, function(parent, child) {
        if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
        else if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
        else if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
        else if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    })
    pointer.moveTo = function() {
        let elem;
        if (arguments.length === 1 && typeof(arguments[0]) === "object") elem = arguments[0];
        else elem = node.element.apply(node, arguments);
        elemCache = elem;
        let s = this.delay(), l = this.duration(), f = this.isAnimating();
        if (f && this.opacity() === 0) this.endAnimate().after(s);
        if (direction === "t") this.cx(elem.cx()).y(elem.my() + gap);
        else if (direction === "b") this.cx(elem.cx()).my(elem.y() - gap);
        else if (direction === "l") this.cy(elem.cy()).x(elem.mx() + gap);
        else if (direction === "r") this.cy(elem.cy()).mx(elem.x() - gap);
        if (f && this.opacity() === 0) this.startAnimate(l).opacity(1);
        else if (this.opacity() === 0) this.opacity(1);
        return this;
    }
    pointer.opacity(0);
    node.childAs(`pointer${id}`, pointer, function(parent, child) {
        if  (!elemCache) return;
        let elem = elemCache;
        if (direction === "t") child.cx(elem.cx()).y(elem.my() + gap);
        else if (direction === "b") child.cx(elem.cx()).my(elem.y() - gap);
        else if (direction === "l") child.cy(elem.cy()).x(elem.mx() + gap);
        else if (direction === "r") child.cy(elem.cy()).mx(elem.x() - gap);
    });
    return pointer;
}