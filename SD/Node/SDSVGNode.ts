import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class SDSVGNode extends SDNode {
    /**
     * Gets the fill color of this component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this component.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    fill(fill?: string) {
        if (arguments.length === 0) return this.vars.fill;
        Check.validateColor(fill, `${this.constructor.name}.fill`);
        this.vars.fill = fill;
        return this;
    }
    /**
     * Gets the stroke color of this component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this component.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    stroke(stroke?: string) {
        if (arguments.length === 0) return this.vars.stroke;
        Check.validateColor(stroke, `${this.constructor.name}.stroke`);
        this.vars.stroke = stroke;
        return this;
    }
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    fillOpacity(opacity?: number) {
        if (arguments.length === 0) return this.vars.fillOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.fillOpacity`);
        this.vars.fillOpacity = opacity;
        return this;
    }
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeOpacity(opacity?: number) {
        if (arguments.length === 0) return this.vars.strokeOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.strokeOpacity`);
        this.vars.strokeOpacity = opacity;
        return this;
    }
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeWidth(width?: number): number | this {
        if (arguments.length === 0) return this.vars.strokeWidth;
        Check.validateNumber(width, `${this.constructor.name}.strokeWidth`);
        this.vars.strokeWidth = width;
        return this;
    }
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashOffset(offset?: number): number | this {
        if (arguments.length === 0) return this.vars.strokeDashOffset;
        Check.validateNumber(offset, `${this.constructor.name}.strokeDashOffset`);
        this.vars.strokeDashOffset = offset;
        return this;
    }
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    strokeDashArray(array?: Array<number>) {
        if (arguments.length === 0) return this.vars.strokeDashArray;
        this.vars.strokeDashArray = array;
        return this;
    }
    color(): SDColor;
    color(color: string | SDColor): this;
    color(color?: string | SDColor) {
        if (arguments.length === 0) return { fill: this.fill(), stroke: this.stroke() } as SDColor;
        Check.validateColor(color, `${this.constructor.name}.color`);
        if (Check.isString(color)) return this.fill(color).stroke(color);
        return this.fill(color.fill).stroke(color.stroke);
    }
    __createSVGNode(label: string, attributes: { [key: string]: any }): RenderNode {
        this.vars.merge(attributes);
        const object = RenderNode.createRenderNode(this, this.layer(), label);
        const attributeMap = {
            x: ["x", Interp.numberInterp],
            y: ["y", Interp.numberInterp],
            x1: ["x1", Interp.numberInterp],
            y1: ["y1", Interp.numberInterp],
            x2: ["x2", Interp.numberInterp],
            y2: ["y2", Interp.numberInterp],
            d: ["d", Interp.pathInterp],
            cx: ["cx", Interp.numberInterp],
            cy: ["cy", Interp.numberInterp],
            r: ["r", Interp.numberInterp],
            rx: ["rx", Interp.numberInterp],
            ry: ["ry", Interp.numberInterp],
            width: ["width", Interp.numberInterp],
            height: ["height", Interp.numberInterp],
            points: ["points", Interp.pointsInterp],
            fill: ["fill", Interp.colorInterp],
            stroke: ["stroke", Interp.colorInterp],
            fillOpacity: ["fill-opacity", Interp.numberInterp],
            strokeOpacity: ["stroke-opacity", Interp.numberInterp],
            strokeWidth: ["stroke-width", Interp.numberInterp],
            strokeDashOffset: ["stroke-dashoffset", Interp.numberInterp],
            strokeDashArray: ["stroke-dasharray", Interp.arrayInterp],
            markerStart: ["marker-start", Interp.stringInterp],
            markerMid: ["marker-mid", Interp.stringInterp],
            markerEnd: ["marker-end", Interp.stringInterp],
            href: ["href", Interp.stringInterp],
        };
        for (const key in attributes) {
            if (!attributeMap[key]) {
                object.setAttribute(key, attributes[key]);
                continue;
            }
            const [aliasKey, interp] = attributeMap[key];
            const watchFunc = Factory.action(this, object, aliasKey, interp);
            this.vars.watch(key, watchFunc);
            object.setAttribute(aliasKey, attributes[key]);
        }
        return object;
    }
}
