import { Mathjax, Text } from "../slide";

/**
 * 为node节点创建标签
 * @param {Node} node 一个节点 
 * @param {string} name 标签名称 
 * @param {"lt"|"lc"|"lb"|"tl"|"tc"|"tr"|"bl"|"bc"|"br"|"rt"|"rc"|"rb"} position 
 * @param {*} fontSize 
 * @returns 
 */
export function Label(node, name, position="lc", fontSize=20, gap=10) {
    let label;
    if (typeof(name) === "string") label = new Text(node, name).fontSize(fontSize);
    else label = name.height(fontSize);
    node.childAs(`label_${name}`, label, function(parent, child) {
        if (position === "lt") child.mx(parent.x() - gap).y(parent.y());
        else if (position === "lc") child.mx(parent.x() - gap).cy(parent.cy());
        else if (position === "lb") child.mx(parent.x() - gap).my(parent.my());
        else if (position === "tl") child.my(parent.y() - gap).x(parent.x());
        else if (position === "tc") child.my(parent.y() - gap).cx(parent.cx());
        else if (position === "tr") child.my(parent.y() - gap).mx(parent.mx());
        else if (position === "bl") child.y(parent.my() + gap).x(parent.x());
        else if (position === "bc") child.y(parent.my() + gap).cx(parent.cx());
        else if (position === "br") child.y(parent.my() + gap).mx(parent.mx());
        else if (position === "rt") child.x(parent.mx() + gap).y(parent.y());
        else if (position === "rc") child.x(parent.mx() + gap).cy(parent.cy());
        else if (position === "rb") child.x(parent.mx() + gap).my(parent.my());
        else throw new Error(`position(${position})不被识别`)
    });
    return label;
}

/**
 * 为node节点创建标签
 * @param {Node} node 一个节点 
 * @param {string} name 标签名称，被认为是一个Mathjax字符串
 * @param {"lt"|"lc"|"lb"|"tl"|"tc"|"tr"|"bl"|"bc"|"br"|"rt"|"rc"|"rb"} position 
 * @param {*} fontSize 
 * @returns 
 */
export function MathjaxLabel(node, name, position="lc", fontSize=20, gap=10) {
    return Label(node, new Mathjax(node, name), position, fontSize, gap);
}