import { Brace } from "SD/Node/Curve/Brace";
import { SDNode } from "SD/Node/SDNode";

interface BraceType extends Brace {
    brace(l: number, r: number): this;

    label(): SDNode;
    label(label: string): this;
    label(label: string, gap: number): this;
}

interface WithBraceType {
    brace(l: number, r: number, location: "b"|"t"|"l"|"r", gap: number): BraceType;
}

export function WithBrace<T>(parent: T): WithBraceType&T;