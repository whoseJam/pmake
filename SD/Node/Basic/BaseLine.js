import { Action } from "@/Animate/Action";
import { BaseNake } from "./BaseNake";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";

export class BaseLine extends BaseNake {
    constructor(parent, tag) {
        super(parent, tag);

        this.member.set("fill-opacity", 0);
        this.member.set("stroke-opacity", 1);
        this.member.set("stroke-width", 1);
        this.member.set("stroke", "#000000");
        this.member.new("marker-start", "");
        this.member.new("marker-mid", "");
        this.member.new("marker-end", "");

        const nake = this._.nake;
        nake.setAttribute("fill-opacity", this.member.get("fill-opacity"));
        nake.setAttribute("stroke-opacity", this.member.get("stroke-opacity"));
        nake.setAttribute("stroke-width", this.member.get("stroke-width"));
        nake.setAttribute("stroke", this.member.get("stroke"));
    }

    markerStart(mark) {
        if (mark === undefined) {
            return this.member.get("marker-start");
        }
        mark = (mark !== "") ? `url(#${mark})` : "";
        this.member.set("marker-start", mark);
        this.tryUpdate();
        return this;
    }

    markerMid(mark) {
        if (mark === undefined) {
            return this.member.get("marker-mid");
        }
        mark = (mark !== "") ? `url(#${mark})` : "";
        this.member.set("marker-mid", mark);
        this.tryUpdate();
        return this;
    }

    markerEnd(mark) {
        if (mark === undefined) {
            return this.member.get("marker-end");
        }
        mark = (mark !== "") ? `url(#${mark})` : "";
        this.member.set("marker-end", mark);
        this.tryUpdate();
        return this;
    }

    arrow(status = true) {
        if (status) {
            this.markerEnd("arrow");
        } else {
            this.markerEnd("");
        }
        return this;
    }

    revArrow(status = true) {
        if (status) {
            this.markerStart("arrowReverse");
        } else {
            this.markerStart("");
        }
        return this;
    }

    doubleArrow(status = true) {
        this.arrow(status);
        this.revArrow(status);
    }

    pointStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([0, len]);
        context.till(0, 1);
        this.strokeDashArray([len, 0]);
        context.recover();
        return this;
    }

    pointTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        context.till(0, 1);
        this.strokeDashOffset(0);
        context.recover();
        return this;
    }

    fadeStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        context.till(0, 1);
        this.strokeDashOffset(-len);
        context.recover();
        return this;
    }

    fadeTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, 0]);
        context.till(0, 1);
        this.strokeDashArray([0, len]);
        context.recover();
        return this;
    }

    update() {
        super.update();
        if (this.member.hasChanged("marker-start")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.oldValue("marker-start"),
                this.get("marker-start"),
                Interp.stringInterp(this._.nake, "marker-start"),
                this, "marker-start"
            );
            this.member.flush("marker-start");
        }
        if (this.member.hasChanged("marker-mid")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.oldValue("marker-mid"),
                this.get("marker-mid"),
                Interp.stringInterp(this._.nake, "marker-mid"),
                this, "marker-mid"
            );
            this.member.flush("marker-mid");
        }
        if (this.member.hasChanged("marker-end")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.oldValue("marker-end"),
                this.get("marker-end"),
                Interp.stringInterp(this._.nake, "marker-end"),
                this, "marker-end"
            );
            this.member.flush("marker-end");
        }
    }
}