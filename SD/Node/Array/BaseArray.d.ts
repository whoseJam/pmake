import { SDNode } from "@/Node/SDNode";
import { Color } from "@/Utility/Color";

export class BaseArray extends SDNode {
    constructor(parent: SDNode);

    start(): number;
    start(start: number): this;
    end(): number;

    length(): number;
    length(length: number): this;
    resize(length: number): this;

    idx(id: number): number;
    indexOf(element: SDNode): number;

    element(id: number): SDNode;
    elements(): Array<SDNode>;
    lastElement(): SDNode;
    firstElement(): SDNode;
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    insert(value: any): this;
    insertFromExistValue(value: SDNode): this;
    insertFromExistElement(element: SDNode): this;
    push(value: any): this;
    pushArray(array: Array<any>): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;

    pop(): this;
    erase(id: number): this;

    dropElement(id: number): SDNode;
    dropFirstElement(id: number): SDNode;
    dropLastElement(id: number): SDNode;
    dropValue(id: number): SDNode;

    text(id: number): string;
    text(id: number, text: string): this;
    intValue(id: number): number;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(id: number): number;
    opacity(id: number, opacity: number): this;

    value(id: number): SDNode;
    value(id: number, value: SDNode): this;

    color(color: Color): this;
    color(id: number): Color;
    color(id: number, color: Color): this;
    color(l: number, r: number, color: Color): this;

    sort(comparator: (a: SDNode, b: SDNode) => number): this;
    sort(l: number, r: number, comparator: (a: SDNode, b: SDNode) => number): this;
}
