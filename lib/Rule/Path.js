
export function PointAtPathByRate(parent, child, k, xloc = "cx", yloc = "cy") {
    return function() {
        let point = parent.at(k);
        child[xloc](point[0]);
        child[yloc](point[1]);
    }
}

export function PointAtPathByLength(parent, child, length) {
    return function() {
        let point = parent.getPointAtLength(length);
        child[xloc](point[0]);
        child[yloc](point[1]);
    }
}