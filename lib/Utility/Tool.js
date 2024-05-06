import { Text } from "../Node/Basic/Text";

export function toNode(node, anything) {
    if (anything === null || anything === undefined) return null;
    if (typeof(anything) === "function") return anything(node);
    else if (typeof(anything) === "string" || typeof(anything) === "number") return new Text(node, anything);
    return anything;
}

export function nakeToD3(nake) {
    throw new Error("Not Implemented Yet");
}

export function d3ToNake(d3) {
    return d3._groups[0][0];
}

export function nakeToSnap(nake) {
    return Snap(nake);
}

export function snapToNake(snap) {
    throw new Error("Not Implemented Yet");
}

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