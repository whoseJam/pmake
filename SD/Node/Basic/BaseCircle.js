import { Action } from "@/Animate/Action";
import { BaseNake } from "./BaseNake";
import { Interp } from "@/Animate/Interp";
import { Vec } from "@/Utility/Math";

export class BaseCircle extends BaseNake {
    constructor(parent, tag) {
        super(parent, tag);
    }

    /**
     * 判断vec是否落在元素范围内
     * @param {[number, number]} vec 
     * @returns {boolean}
     */
    inRange(vec) {
        const center = [this.cx(), this.cy()];
        const length = Vec.length(Vec.sub(vec, center));
        return length <= this.r();
    }

    cx(cx) {
        if (cx === undefined) {
            return this.member.get("cx");
        }
        this.member.setByEqual("cx", cx);
        this.tryUpdate();
        return this;
    }

    cy(cy) {
        if (cy === undefined) {
            return this.member.get("cy");
        }
        this.member.setByEqual("cy", cy);
        this.tryUpdate();
        return this;
    }

    /**
     * 设置元素的半径
     * @overload
     * @param {number} r 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    r(r) {
        if(r === undefined) {
            return this.member.get("r");
        }
        this.member.setByEqual("r", r);
        this.tryUpdate();
        return this;
    }

    update() {
        super.update();
        if (this.member.hasChanged("cx")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("cx"),
                this.member.get("cx"),
                Interp.numberInterp(this._.nake, "cx"),
                this, "cx"
            );
            this.member.flush("cx");
        }
        if (this.member.hasChanged("cy")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("cy"),
                this.member.get("cy"),
                Interp.numberInterp(this._.nake, "cy"),
                this, "cy"
            );
            this.member.flush("cy");
        }
        if (this.member.hasChanged("r")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("r"),
                this.member.get("r"),
                Interp.numberInterp(this._.nake, "r"),
                this, "r"
            );
            this.member.flush("r");
        }
    }
}