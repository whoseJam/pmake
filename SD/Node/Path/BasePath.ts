import { Context } from "@/Animate/Context";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { Check } from "@/Utility/Check";
import { Color as C, SDAllColor, SDPacketColor } from "@/Utility/Color";
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
    color(): SDPacketColor;
    color(color: SDAllColor): this;
    color(color?: SDAllColor): SDPacketColor | this {
        if (arguments.length === 0) return { fill: this.fill(), stroke: this.stroke() };
        Check.validateColor(color, `${this.constructor.name}.color`);
        if (C.isPacket(color)) return this.fill(C.toFill(color)).stroke(C.toStroke(color));
        return this.stroke(color);
    }

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
    doubleArrow(arrow?: true): this;
    doubleArrow(cancel: null | undefined | false): this;
    doubleArrow(arrow_ = true) {
        const arrow = arrow_ ? true : null;
        return this.arrow(arrow).revArrow(arrow);
    }
    /**
     * Makes this component gradually appear from the starting point to the ending point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component appear with an arrow at the ending point.
     * line.startAnimate().pointStoT().endAnimate().arrow();
     */
    pointStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([0, len]);
        context.till(0, 1);
        this.strokeDashArray([len, 0]);
        return this;
    }
    /**
     * Makes this component gradually appear from the ending point to the starting point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component appear with an arrow at the starting point.
     * line.startAnimate().pointTtoS().endAnimate().revArrow();
     */
    pointTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        context.till(0, 1);
        this.strokeDashArray([len, 0]);
        this.strokeDashOffset(0);
        return this;
    }
    /**
     * Makes this component gradually fade from the starting point to the ending point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component with an arrow at the ending point fade.
     * line.startAnimate().fadeStoT().endAnimate().arrow(null);
     */
    fadeStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        context.till(0, 1);
        this.strokeDashArray([0, len]);
        this.strokeDashOffset(-len);
        return this;
    }
    /**
     * Makes this component gradually fade from the ending point to the starting point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a lien component with an arrow at the starting point fade.
     * line.startAnimate().fadeTtoS().endAnimate().revArrow(null);
     */
    fadeTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, 0]);
        context.till(0, 1);
        this.strokeDashArray([0, len]);
        return this;
    }
    /**
     * Gets the coordinates of a point along this path component at a specified fractinal position.
     * - 0 corresponds to the starting point of the path.
     * - 1 corresponds to the ending point of the path.
     * @param k - A numeric value between 0 and 1 representing the fraction of the path length.
     * @returns The coordinates of the point.
     */
    at(k: number): [number, number] {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.at`);
        return [0, 0];
    }
    /**
     * Gets the coordinates of a point along this path component at a specified distance.
     * @param length - The cumulative distance from the start of the path component.
     * @returns The coordinates of the point.
     */
    getPointAtLength(length: number): [number, number] {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.getPointAtLength`);
        return [0, 0];
    }
    /**
     * Gets the total length of this path component.
     * @returns The total length.
     */
    totalLength(): number {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.totalLength`);
        return 0;
    }

    __createSVGNode(label: string, attributes?: { [key: string]: any }) {
        return super.__createSVGNode(label, {
            ...BASE_PATH_ATTRIBUTES,
            ...(attributes || {}),
        });
    }
}
