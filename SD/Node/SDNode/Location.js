
export function Scale(scale) {
    const width = this.width();
    const height = this.height();
    this.freeze();
    this.width(width);
    this.height(height);
    this.unfreeze();
    return this;
}

export function Position(xloc, yloc, dx = 0, dy = 0) {
    return [
        this[xloc]() + dx,
        this[yloc]() + dy
    ];
}

export function Center(cx, cy) {
    if (cx === undefined) {
        return [this.cx(), this.cy()];
    } else if (arguments.length === 1) {
        const center = arguments[0];
        return this.center(center[0], center[1]);
    }
    this.freeze();
    this.cx(cx).cy(cy);
    this.unfreeze();
    return this;
}

export function KQuantileLocation(loc, size) {
    return function(k) {
        return this[loc]() + k * this[size]();
    };
}

export function CenterLocation(loc, size) {
    return function(x) {
        if (x === undefined) {
            return this[loc]() + this[size]() / 2;
        }
        this[loc](x - this[size]() / 2);
        return this;
    }
}

export function MaxiumLocation(loc, size) {
    return function(mx) {
        if (mx === undefined) {
            return this[loc]() + this[size]();
        }
        this[loc](mx - this[size]());
        return this;
    }
}

export function MoveTheLocation(loc) {
    return function(d) {
        this[loc](this[loc]() + d);
        return this;
    }
}