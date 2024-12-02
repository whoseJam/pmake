import { SDNode } from "@/Node/SDNode";

export class Exit {

    static naive(parent: SDNode, child: string|SDNode): void;

    static ordinary(parent: SDNode, child: string|SDNode): void;

    static fade(): (element: SDNode) => void;
    static drop(): (element: SDNode) => void;
}

export function exit(): typeof Exit;