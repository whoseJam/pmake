import { SDNode } from "SD/Node/SDNode";
import { Selection } from "d3";

type D3Selection = Selection<any, any, any, any>;

export class D3Layer {
    constructor(node: SDNode|D3Layer, name: number|string);

    newLayer(layerName: number|string): D3Layer;

    layer(layerName: number|string): D3Layer;

    attachTo(layer: D3Layer): void;

    type(): string;
    type(layerName: number|string): void;

    append(tag: string): D3Selection;

    nake(): Element;
}