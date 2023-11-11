
export function Background() {
    return function(parent, child) {
        let x = parent.x();
        let y = parent.y();
        let width = parent.width();
        let height = parent.height();
        child.x(x).y(y);
        child.width(width);
        child.height(height);
    }
}