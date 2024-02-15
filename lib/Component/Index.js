import { Stack } from "../slide";
import { Array } from "../slide";

/**
 * 为node节点创建索引，注意此索引是不变的，不考虑node节点的添加删除操作
 * @param {Node} node 一个序列节点，或者一个网格节点
 * @param {"t"|"b"|"l"|"r"} position 索引摆放方式
 * @returns 索引节点
 */
export function Index(node, position="t") {
    let index;
    if (position === "t" || position === "b") index = new Array(node);
    else index = new Stack(node);
    index.elementHeight(20);
    if (node.start) {
        for (let i = node.start(); i <= node.end(); i++) index.push(i);
    } else if (node.startN) {
        let startFunc = "startM", endFunc = "endM";
        if (position === "t" || position === "b")
            [startFunc, endFunc] = ["startN", "endN"];
        for (let i = node[startFunc](); i <= node[endFunc](); i++)
            index.push(i);
    }
    for (let i = index.start(); i <= index.end(); i++)
        index.element(i).fillOpacity(0).strokeOpacity(0);
    node.childAs(`index_${position}`, index, function(parent, child) {
        child.elementWidth(parent.elementWidth());
        if (position === "t") child.x(parent.x()).my(parent.y());
        else if (position === "b") child.x(parent.x()).y(parent.my());
    })
    return index;
}