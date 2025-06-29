import { SDNode } from "@/Node/SDNode";
import { TextEngine } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

export function createMathjaxRenderNode(parent: SDNode, render: RenderNode, element: number | string | SVGElement) {
    // @ts-ignore
    if (typeof element === "number" || typeof element === "string") element = MathJax.tex2svg(element).children[0];
    const svg = element as SVGSVGElement;
    for (const key of ["fill", "stroke"]) {
        svg.setAttribute(key, svg.children[1].getAttribute(key));
        svg.children[1].removeAttribute(key);
    }
    return new MathjaxNode(parent, render, svg);
}

const scale = 5 / 100;

export class MathjaxNode extends SVGNode {
    x: number;
    y: number;
    sx: number;
    sy: number;
    ix: number;
    iy: number;
    constructor(parent: SDNode, render: RenderNode, element: SVGElement) {
        super(parent, render, element);
        this.x = 0;
        this.y = 0;
        this.ix = 0;
        this.iy = 0;
        TextEngine.adjustMathjax(this);
    }
    getAttribute(key: string) {
        if (key === "x") return this.ix;
        if (key === "y") return this.iy;
        return super.getAttribute(key);
    }
    setAttribute(key: string, value: any): void {
        if (key === "x") return super.setAttribute("x", value - this.x);
        if (key === "y") return super.setAttribute("y", value - this.y);
        super.setAttribute(key, value);
    }
}
