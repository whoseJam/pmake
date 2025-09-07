import { Context } from "@/Animate/Context";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

const BASE_PATH_ATTRIBUTES = {
    fill: C.white,
    fillOpacity: 0,
    stroke: C.black,
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDashOffset: 0,
    strokeDashArray: [1, 0],
    markerStart: "",
    markerMid: "",
    markerEnd: "",
};

export class BasePath extends SDSVGNode {
    markerStart(): string;
    markerStart(marker: string): this;
    markerStart(marker?: string) {
        if (marker === undefined) return this.vars.markerStart;
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars.markerStart = marker;
        return this;
    }
    markerMid(): string;
    markerMid(marker: string): this;
    markerMid(marker?: string) {
        if (marker === undefined) return this.vars.markerMid;
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars.markerMid = marker;
        return this;
    }
    markerEnd(): string;
    markerEnd(marker: string): this;
    markerEnd(marker?: string) {
        if (marker === undefined) return this.vars.markerEnd;
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars.markerEnd = marker;
        return this;
    }
    /**
     * Sets an arrow to the end of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    arrow(arrow?: true): this;
    /**
     * Removes the arrow at the end of this path component.
     * @param cancel
     * @returns The current component instance for method chaining.
     */
    arrow(cancel: null | undefined | false): this;
    arrow(arrow = true) {
        return this.markerEnd(arrow ? "arrow" : "");
    }
    /**
     * Sets an arrow to the start of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    revArrow(arrow?: true): this;
    /**
     * Removes the arrow at the start of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    revArrow(cancel: null | undefined | false): this;
    revArrow(arrow = true) {
        return this.markerStart(arrow ? "arrow" : "");
    }
    doubleArrow(arrow = true) {
        return this.arrow(arrow).revArrow(arrow);
    }
    pointStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([0, len]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        return this;
    }
    pointTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        this.strokeDashOffset(0);
        return this;
    }
    fadeStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        this.strokeDashOffset(-len);
        return this;
    }
    fadeTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, 0]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        return this;
    }
    at(k) {
        ErrorLauncher.notImplementedYet("at", this.type());
    }
    getPointAtLength(length) {
        ErrorLauncher.notImplementedYet("getPointAtLength", this.type());
    }
    totalLength(): number {
        ErrorLauncher.notImplementedYet("totalLength", this.type());
        return 0;
    }
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        rule = getValueRule(rule);
        value = Cast.castToSDNode(this, value);
        this.childAs("value", value, rule);
        return this;
    }
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        rule = getValueRule(rule);
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule);
        return this;
    }
    __createSVGNode(label: string) {
        return super.__createSVGNode(label, BASE_PATH_ATTRIBUTES);
    }
}

Object.assign(BasePath.prototype, {
    markerStart: handlerMarker("markerStart"),
    markerMid: handlerMarker("markerMid"),
    markerEnd: handlerMarker("markerEnd"),
    // text: BaseElement.prototype.text,
    // intValue: BaseElement.prototype.intValue,
});

function handlerMarker(key) {
    return function (marker) {
        if (marker === undefined) return this.vars[key];
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars[key] = marker;
        return this;
    };
}

function getValueRule(rule) {
    return rule ? rule : R.pointAtPathByRate(0.5, "cx", "cy");
}
