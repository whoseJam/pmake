import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color as C, SDAllColor, SDHEXColor } from "@/Utility/Color";

export abstract class SDSVGNode extends SDNode {
    /**
     * Gets the fill color of this component.
     * @returns The fill color.
     */
    getFill(): SDHEXColor {
        return C.toHEX(this.vars.fill);
    }
    /**
     * Sets the fill color of this component.
     * @param fill - The fill color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    setFill(fill?: SDAllColor) {
        this.vars.fill = C.toRGB(C.toFill(fill));
        return this;
    }

    /**
     * Gets the stroke color of this component.
     * @returns The stroke color.
     */
    getStroke(): SDHEXColor {
        return C.toHEX(this.vars.stroke);
    }
    /**
     * Sets the stroke color of this component.
     * @param stroke - The stroke color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    setStroke(stroke: SDAllColor): this {
        this.vars.stroke = C.toRGB(C.toStroke(stroke));
        return this;
    }

    getFillOpacity(): number {
        return this.vars.fillOpacity;
    }

    setFillOpacity(opacity: number): this {
        this.vars.mpset("fillOpacity", opacity);
        return this;
    }

    getStrokeOpacity(): number {
        return this.vars.strokeOpacity;
    }

    setStrokeOpacity(opacity: number): this {
        this.vars.mpset("strokeOpacity", opacity);
        return this;
    }

    getStrokeWidth(): number {
        return this.vars.strokeWidth;
    }

    setStrokeWidth(width: number): this {
        this.vars.mpset("strokeWidth", width);
        return this;
    }

    getStrokeDashOffset(): number {
        return this.vars.strokeDashOffset;
    }

    setStrokeDashOffset(offset: number): this {
        this.vars.lpset("strokeDashOffset", offset);
        return this;
    }

    getStrokeDashArray(): Array<number> {
        return this.vars.strokeDashArray;
    }

    setStrokeDashArray(array: Array<number>): this {
        this.vars.strokeDashArray = array;
        return this;
    }

    __createSVGNode(label: string, attributes: { [key: string]: any }): RenderNode {
        this.vars.merge(attributes);
        const object = RenderNode.createRenderNode(this, this.getLayer(), label);
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
            fontSize: ["font-size", Interp.numberInterp],
            fontFamily: ["font-family", Interp.stringInterp],
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
            src: ["href", Interp.stringInterp],
        };
        for (const key in attributes) {
            if (!attributeMap[key]) {
                object.setAttribute(key, attributes[key]);
                continue;
            }
            const [aliasKey, interp] = attributeMap[key];
            const watchCallback = SDNode.__action(this, object, aliasKey, interp);
            this.vars.watch(key, watchCallback);
            if (aliasKey !== "stroke-dasharray" && aliasKey !== "stroke-dashoffset")
                object.setAttribute(aliasKey, attributes[key]);
        }
        return object;
    }
}
