import { D3Helper } from "../Utility/D3Helper";

export function Group(self, node) {
    let parent = (typeof(node.g) === "function") ? node.g() : node;

    self._.group = parent.append("g");
 
    self.g = g;
    self.layer = layer;
    self.newLayer = newLayer;
    self.attachTo = attachTo;

    return self;
}

function g() {
    return this._.group;
}

function layer(name) {
    return this._["layer_" + name];
}

function newLayer(name) {
    let layer = this._.group.append("g");
    layer.attr(name, "");
    this._["layer_" + name] = layer;
    return layer;
}

function attachTo(node) {
    let parent = (typeof(node.g) === "function") ? node._.group : node;
    Snap(D3Helper.element(parent)).append(
        Snap(D3Helper.element(this._.group))
    );
}