import { SDNode } from "../SDNode";

export class Interact {
    constructor(parent: SDNode);

    onClick(callback: (element: SDNode) => void): this;
    onDblClick(callback: (element: SDNode) => void): this;
    drag(type: true|false): this;
}