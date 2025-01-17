import { SDNode } from "@/Node/SDNode";
import { MathAtom } from "@/Node/Text/MathAtom";

export class Mathjax extends SDNode {
    constructor(parent: SDNode);
    constructor(parent: SDNode, text: string);

    math(text: string): this;
    element(index: number): MathAtom;

    createMath(index: number): Mathjax;
    transformMath(text: string, hint: {}): this;
    transformMathFrom(text: string, math: Array<Mathjax>, hint: {}): this;
}
