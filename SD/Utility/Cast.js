

export function AnythingToSDNode(node, anything) {
    if (anything === null || anything === undefined) return null;
    if (typeof(anything) === "function") return anything(node);
    else if (typeof(anything) === "string" || typeof(anything) === "number") return new Text(node, anything);
    return anything;
}

export function D3ToNake(d3) {
    return d3._groups[0][0];
}

export function NakeToSnap(nake) {
    return Snap(nake);
}

export function SelectValidValue(value1, value2) {
    return value1 === undefined || value1 === null? value2 : value1;
}