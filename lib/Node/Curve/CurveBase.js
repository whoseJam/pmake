import { Path } from "../Basic/Path";

/**
 * @class CurveBase
 * @description 曲线类的基类，一个曲线类主要由起点和终点固定轨迹，不同的曲线有不同的附加参数来精细化控制曲线。
 * 每个曲线子类应该实现一个pathCalculator函数，用来计算该类内部curve对象的d属性，每当x1,x2,y1,y2其中之一被
 * 修改过后，或者曲线的附加参数被修改过后，都应该重新调用pathCalculator，并对curve对象的d属性进行重设
 */
export class CurveBase extends Path {
    constructor(node) {
        super(node);
        this._.x1 = 0;
        this._.y1 = 0;
        this._.x2 = 40;
        this._.y2 = 40;
    }

    x1(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x1;
        this._.x1 = x;
        console.log("set x1=", x);
        this.dirty();
        return this;
    }
    y1(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y1;
        this._.y1 = y;
        this.dirty();
        return this;
    }
    x2(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x2;
        this._.x2 = x;
        this.dirty();
        return this;
    }
    y2(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y2;
        this._.y2 = y;
        this.dirty();
        return this;
    }

    update() {
        this.preUpdate();
        this.d(this.pathCalculator());
        this.postUpdate();
        return this;
    }
}
