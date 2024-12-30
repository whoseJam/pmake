import { Rect } from "@/Node/Nake/Rect";
import { SDNode } from "@/Node/SDNode";

export class CompFocus {
    focus(): this;
    focus(i: number): this;
    focus(l: number, r: number): this;
    focus(i: number, j: number): this;
    focus(i1: number, j1: number, i2: number, j2: number): this;
}

export function Focus(parent: SDNode): CompFocus & Rect;
