import { Color } from "@/Utility/Color";

import { SDNode } from "@/Node/SDNode";

export class BaseElement extends SDNode {
    constructor(parent: any);

    rate(): number;
    rate(rate: number): this;
    
    fill(): Color;
    fill(fill: Color): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;

    stroke(): Color;
    stroke(stroke: Color): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;

    drop(): this;

    value(): SDNode;
    value(value: SDNode): this;

    valueFromExist(value: SDNode): this;
}