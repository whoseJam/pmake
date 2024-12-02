import { SDNode } from "@/Node/SDNode";

export class Enter {
    static ordinary(parent: SDNode);
    static ordinary(parent: SDNode, layer: string);

    static fromExist(parent: SDNode);
    static fromExist(parent: SDNode, layer: string);

    static fromExistValue(parent: SDNode, value: SDNode);
    static fromExistValue(parent: SDNode, value: SDNode, layer: string);

    static appear(): (element: SDNode, move: () => void) => void;
    static appear(layer: string): (element: SDNode, move: () => void) => void;
    static moveTo(): (element: SDNode, move: () => void) => void;
    static moveTo(layer: string): (element: SDNode, move: () => void) => void;
}

export function enter(): typeof Enter;