import { D3ToNake } from "@/Utility/Cast";

import { Action } from "@/Animate/Action";

export class D3Layer {
    constructor(node, name) {
        const isSDNode = "g" in node;
        const parentLayer = isSDNode ? node.g() : node;
        const parentNode  = isSDNode ? node : node.node;
        this.d3     = parentLayer.append("g");
        this.node   = parentNode;
        this.parent = parentLayer;
        if (name) this.d3.attr(name, "");
    }

    newLayer(layerName) {
        const layer = `layer_${layerName}`;
        if (layer in this) {
            throw new Error(`Layer Named ${layerName} Already Existed`);
        }
        this[layer] = new D3Layer(this.node, layerName);
        this[layer].node = this.node;
        return this[layer];
    }

    layer(layerName) {
        const layer = `layer_${layerName}`;
        if (layer in this) {
            return this[layer];
        }
        throw new Error(`Layer Named ${layerName} Not Exists`);
    }

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
                    Snap(D3ToNake(moveTo)).append(
                        Snap(D3ToNake(d3))
                    );
                }
            },
            this, "attach-to"
        );
        this.parent = layer;
    }

    type(layerName) {
        const nake = D3ToNake(this.d3);
        if (layerName === undefined) {
            const type = nake.getAttribute("type");
            return type ? type : "None";
        }
        nake.setAttribute("type", layerName);
    }

    append(tag) {
        return this.d3.append(tag);
    }

    nake() {
        return D3ToNake(this.d3);
    }

    self() {
        return this.d3;
    }

    allowPointerEvents() {
        this.d3.style("pointer-events", "auto");
    }

    disablePointerEvents() {
        this.d3.style("pointer-events", "none");
    }
}