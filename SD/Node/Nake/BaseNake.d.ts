import { SDNode } from "../SDNode";

type color = string;

export class BaseNake extends SDNode {
    constructor(parent: any, tag: string);

    fill(): color;
    fill(fill: color): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this
    stroke(): color;
    stroke(stroke: color): this;
    strokeOpacity(): number
    strokeOpacity(opacity: number): this
    strokeWidth(): number
    strokeWidth(width: number): this
    strokeDashOffset(): number
    strokeDashOffset(offset: number): this
    strokeDashArray(): Array<number>
    strokeDashArray(array: Array<number>): this
    color(): color;
    color(color: color): this;
}