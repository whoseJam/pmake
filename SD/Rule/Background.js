
export function Background() {
    return (parent, child) => {
        let x = parent.x();
        let y = parent.y();
        let width = parent.width();
        let height = parent.height();
        child.x(x).y(y);
        child.width(width);
        child.height(height);
    }
}

export function CircleBackground() {
    return (parent, child) => {
        const x = parent.x();
        const y = parent.y();
        const r = parent.r();
        child.r(r).x(x).y(y);
    }
}