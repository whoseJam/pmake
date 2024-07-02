import { Action } from "@/Animate/Action";
import { BaseNake } from "./BaseNake";
import { Interp } from "@/Animate/Interp";

export class BaseRect extends BaseNake {
    constructor(parent, tag) {
        super(parent, tag);

        this.member.new("x", 0);
        this.member.new("y", 0);
        this.member.new("width", 40);
        this.member.new("height", 40);
    }

    x(x) {
        if (x === undefined) {
            return this.member.get("x");
        }
        this.member.setByEqual("x", x);
        this.tryUpdate();
        return this;
    }

    y(y) {
        if (y === undefined) {
            return this.member.get("y");
        }
        this.member.setByEqual("y", y);
        this.tryUpdate();
        return this;
    }

    width(width) {
        if (width === undefined) {
            return this.member.get("width");
        }
        this.member.setByEqual("width", width);
        this.tryUpdate();
        return this;
    }

    height(height) {
        if (height === undefined) {
            return this.member.get("height");
        }
        this.member.setByEqual("height", height);
        this.tryUpdate();
        return this;
    }

    update() {
        super.update();
        if (this.member.hasChanged("x")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("x"),
                this.member.get("x"),
                Interp.numberInterp(this._.nake, "x"),
                this, "x"
            );
            this.member.flush("x");
        }
        if (this.member.hasChanged("y")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("y"),
                this.member.get("y"),
                Interp.numberInterp(this._.nake, "y"),
                this, "y"
            );
            this.member.flush("y");
        }
        if (this.member.hasChanged("width")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("width"),
                this.member.get("width"),
                Interp.numberInterp(this._.nake, "width"),
                this, "width"
            );
            this.member.flush("width");
        }
        if (this.member.hasChanged("height")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("height"),
                this.member.get("height"),
                Interp.numberInterp(this._.nake, "height"),
                this, "height"
            );
            this.member.flush("height");
        }
    }
}