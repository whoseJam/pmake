
export function Background() {
    return function (parent, child) {
        const x = parent.x();
        const y = parent.y();
        const width = parent.width();
        const height = parent.height();
        child.width(width);
        child.height(height);
        child.x(x).y(y);
    }
}

export function CircleBackground() {
    return function (parent, child) {
        const x = parent.x();
        const y = parent.y();
        const r = parent.r();
        child.r(r).x(x).y(y);
    }
}