import { BaseLine } from "./BaseLine";

export class BaseLink extends BaseLine {
    constructor(parent, tag) {
        super(parent, tag);
        
        this.member.new("value-rule", undefined);
    }

    source(x, y) {
        if (arguments.length === 0) {
            return [this.x1(), this.y1()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.source(point[0], point[1]);
        }
        this.x1(x).y1(y);
        return this;
    }

    target(x, y) {
        if (arguments.length === 0) {
            return [this.x2(), this.y2()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.target(point[0], point[1]);
        }
        this.x2(x).y2(y);
        return this;
    }

    x(x) {
        const x1 = this.x1();
        const x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) {
            return ox;
        }
        const dx = x - ox;
        this.x1(x1 + dx).x2(x2 + dx);
        return this;
    }

    y(y) {
        const y1 = this.y1();
        const y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) {
            return oy;
        }
        const dy = y - oy;
        this.y1(y1 + dy).y2(y2 + dy);
        return this;
    }

    width(width) {
        const x1 = this.x1();
        const x2 = this.x2();
        if (width === undefined) {
            return Math.abs(x1 - x2);
        }
        if (x1 < x2) {
            this.x2(x1 + width);
        } else {
            this.x1(x2 + width);
        }
        return this;
    }

    height(height) {
        const y1 = this.y1();
        const y2 = this.y2();
        if (height === undefined) {
            return Math.abs(y1 - y2);
        }
        if (y1 < y2) {
            this.y2(y1 + height);
        } else {
            this.y1(y2 + height);
        }
        return this;
    }
}