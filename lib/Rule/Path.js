
export function PointAtPathByRate(k, xloc = "cx", yloc = "cy", gapx = 0, gapy = 0) {
    return function(parent, child) {
        let point = parent.at(k);
        child[xloc](point[0] + gapx);
        child[yloc](point[1] + gapy);
    }
}

export function PointAtPathByLength(length, xloc = "x", yloc = "y") {
    return function(parent, child) {
        let point = parent.getPointAtLength(length);
        child[xloc](point[0]);
        child[yloc](point[1]);
    }
}