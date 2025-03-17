import { SDNode } from "@/Node/SDNode";
import { MathAtom } from "@/Node/Text/MathAtom";
import { RenderNode } from "@/Renderer/RenderNode";

export class Mathjax extends SDNode {
    constructor(target: SDNode | RenderNode);
    constructor(target: SDNode | RenderNode, text: string);

    math(text: string): this;
    element(index: number): MathAtom;
    createMath(index: number): Mathjax;
    transformMath(text: string, hint: {}): this;
    transformMathFrom(text: string, math: Array<Mathjax>, hint: {}): this;
}
