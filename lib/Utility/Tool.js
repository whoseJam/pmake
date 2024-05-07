// @ts-check
import { SDNode } from "../Node/Node";
import { Text } from "../Node/Basic/Text";

/**
 * 将任意对象，转为一个SDNode
 * @param {SDNode} node 
 * @param {any} anything 
 * @returns {SDNode}
 */
export function toNode(node, anything) {
    if (anything === null || anything === undefined) return null;
    if (typeof(anything) === "function") return anything(node);
    else if (typeof(anything) === "string" || typeof(anything) === "number") return new Text(node, anything);
    return anything;
}

/**
 * 将一个原生DOM元素，转为D3Node
 * @param {SVGElement} nake 
 */
export function nakeToD3(nake) {
    throw new Error("Not Implemented Yet");
}

/**
 * 将一个D3Node，转为原生DOM元素
 * @param {import("../Node/Node").D3Node} d3 
 * @returns {SVGElement}
 */
export function d3ToNake(d3) {
    return d3._groups[0][0];
}

/**
 * 将一个原生DOM元素，转为SnapNode
 * @param {SVGElement} nake 
 * @returns {import("../Node/Node").SnapNode}
 */
export function nakeToSnap(nake) {
    // @ts-ignore
    return Snap(nake);
}

/**
 * 将一个SnapNode，转为原生DOM元素
 * @param {import("../Node/Node").SnapNode} snap
 * @returns {SVGElement}
 */
export function snapToNake(snap) {
    throw new Error("Not Implemented Yet");
}

/**
 * 使用Snapsvg的方法，发起一段动画
 * @param {import("../Node/Node").SnapNode} elem 
 * @param {string} name 
 * @param {any} value 
 * @param {number} start 
 * @param {number} end 
 */
export function snapAnimate(elem, name, value, start, end) {
    let args = [];
    args[name] = value;
    console.assert(start === 0, start);
    if (start === 0) {
        elem.animate(args, end - start, mina.easeinout);
    } else {
        throw new Error("Not Implemented Yet");
    }
}

export function snapAction(conf) {
    let elem = conf.elem;
    let action = {};
    action.startStamp = conf.start;
    action.endStamp = conf.end;
    action.channel = conf.key;
    // @ts-ignore
    action.frame = window.__frame__;
    action.value = conf.value;
    let duration = conf.end - conf.start;
    let args = {}, anim = null;
    args[conf.key] = conf.value;
    action.start = function() {
        if (this.startStamp === this.endStamp) elem.attr(args);
        else anim = elem.animate(args, duration, mina.easeinout);
    };
    action.stop = function(stopBy) {
        if (anim) anim.stop();
    }
    setTimeout(action.start.bind(action), action.startStamp);
}

/**
 * 获取一个dagreGraph的边界盒
 * @param {any} graph 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
export function dagreGraphToBox(graph) {
    let minX, maxX, minY, maxY;
    graph.nodes().forEach(function(info) {
        let layout = graph.node(info);
        if (minX === undefined) {
            minX = maxX = layout.x;
            minY = maxY = layout.y;
        } else {
            minX = Math.min(minX, layout.x);
            maxX = Math.max(maxX, layout.x);
            minY = Math.min(minY, layout.y);
            maxY = Math.max(maxY, layout.y);
        }
    })
    if (minX === undefined)
        minX = maxX = minY = maxY = 0;
    return {
        x: minX, y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}