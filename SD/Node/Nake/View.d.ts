import { SDNode } from "@/Node/SDNode";

type ViewBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class View extends SDNode {
    constructor(parent: SDNode);

    push(element: SDNode): this;
    viewBox(): ViewBox;
    viewBox(viewBox: ViewBox): this;
    viewBox(x: number, y: number, width: number, height: number): this;
}
