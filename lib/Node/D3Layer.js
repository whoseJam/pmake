import { SnapLine } from "@antv/g6";
import { d3ToNake } from "../Utility/Tool";
import { SDNode } from "./Node";
import { Action } from "@/Animate/Action";

export class D3Layer {
    /**
     * @param {SDNode|D3Layer} node 
     * @param {number|string} name 
     */
    constructor(node, name) {
        const parentLayer = ("g" in node) ? node.g() : node;
        const parentNode = ("g" in node) ? node : node.node;
        this.d3 = parentLayer.append("g");
        this.node = parentNode;
        this.parent = parentLayer;
        if (name) this.d3.attr(name, "");
    }

    /**
     * @param {number|string} layerName 
     * @returns {D3Layer}
     */
    newLayer(layerName) {
        const layer = `layer_${layerName}`;
        if (layer in this) throw new Error("Layer Name Already Existed");
        this[layer] = new D3Layer(this.node, layerName);
        this[layer].node = this.node;
        return this[layer];
    }

    /**
     * @param {number|string} layerName 
     * @returns {D3Layer}
     */
    layer(layerName) {
        const layer = `layer_${layerName}`;
        return this[layer];
    }

    /**
     * @param {D3Layer} layer 
     */
    attachTo(layer) {
        const node = this.node;
        const d3 = this.d3;
        new Action(
            node.delay() + node.duration(),
            node.delay() + node.duration(),
            this.parent, layer,
            function(t) {
                if (t === 1) {
                    const A = this.from;
                    const B = this.to;
                    const moveTo = ("d3" in B) ? B.d3 : B;
                    Snap(d3ToNake(moveTo)).append(
                        Snap(d3ToNake(d3))
                    );
                }
            },
            this, "attach-to"
        );
        this.parent = layer;
        // Snap(d3ToNake(layer.d3)).append(
        //     Snap(d3ToNake(this.d3)));
    }

    /**
     * @param {number|string} layerName 
     */
    type(layerName) {
        const nake = d3ToNake(this.d3);
        nake.setAttribute("type", layerName);
    }

    /**
     * @param {string} tag 
     * @returns {d3.Selection}
     */
    append(tag) {
        return this.d3.append(tag);
    }

    /**
     * @returns {SVGElement}
     */
    nake() {
        return d3ToNake(this.d3);
    }
}