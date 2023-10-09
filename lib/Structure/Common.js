import { timeout } from "d3";

export function remove(only_this = false) {
    let group = this.get("group");
    if (!only_this) {
        let children = this.children;
        children.forEach((child) => {
            child.remove();
        });
    }
    if (this.delay() + this.duration() >= 100) {
        timeout(() => {
            group.remove();
            for (let prop in this)
                delete this[prop];
        }, this.delay() + this.duration());
    } else {
        group.remove();
        for (let prop in this)
            delete this[prop];
    }
}

export function inRange(vec) {
    let minX = this.x(), maxX = this.mx();
    let minY = this.y(), maxY = this.my();
    return minX <= vec[0] && vec[0] <= maxX &&
           minY <= vec[1] && vec[1] <= maxY;
}

export function opacity(opacity) {
    let children = this.children;
    children.forEach((child) => {
        child.opacity(opacity);
    });
    return this;
}