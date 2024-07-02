import { SDNode } from "../Node/SDNode";
import { Stack } from "../Node/Array/Stack";
import { Array } from "../Node/Array/Array";

let id = 0;

function initIndex(index, node, position) {
    const layoutOnRow = (position === "t" || position === "b");
    const fixLenLoc = (layoutOnRow ? "elementHeight" : "elementWidth");
    const len = (layoutOnRow ? 20 : 10);
    index[fixLenLoc](len);
    if (node.start) {
        for (let i = node.start(); i <= node.end(); i++) index.push(i);
    } else if (node.startN) {
        let startFunc = "startM", endFunc = "endM";
        if (position === "l" || position === "r")
            [startFunc, endFunc] = ["startN", "endN"];
        for (let i = node[startFunc](); i <= node[endFunc](); i++)
            index.push(i);
    }
    for (let i = index.start(); i <= index.end(); i++)
        index.element(i).fillOpacity(0).strokeOpacity(0);
}

/**
 * 为node节点创建索引，注意此索引是不变的，不考虑node节点的添加删除操作
 * @param {SDNode} node 一个序列节点，或者一个网格节点
 * @param {"t"|"b"|"l"|"r"} position 索引摆放方式
 * @returns 索引节点
 */
export function Index(node, position="t") {
    const layoutOnRow = (position === "t" || position === "b");
    const index = (layoutOnRow ? new Array(node) : new Stack(node));
    const spanLenLoc = (layoutOnRow ? "elementWidth" : "elementHeight");
    initIndex(index, node, position);
    index[spanLenLoc](node[spanLenLoc]());
    const rule = (parent, child) => {
        child[spanLenLoc](parent[spanLenLoc]());
        if (position === "t")      child.x(parent.x()).my(parent.y());
        else if (position === "b") child.x(parent.x()).y(parent.my());
        else if (position === "l") child.mx(parent.x() - 2).y(parent.y());
        else if (position === "r") child.x(parent.mx() + 2).y(parent.y());
    }
    node.childAs(`index_${++id}`, index, rule);
    return index;
}