import { SDNode }  from "@/Node/SDNode";
import { TeXAtom } from "@/Node/Text/TeXAtom";

export class Mathjax extends SDNode {
    constructor(parent: SDNode);
    constructor(parent: SDNode, text: string);

    math(text: string): this;
    element(index: number): TeXAtom;

    createMath(index: number): Mathjax;
    transformMath(text: string, hint: {}): this;
    transformMathFrom(text: string, math: Array<Mathjax>, hint: {}): this;
}