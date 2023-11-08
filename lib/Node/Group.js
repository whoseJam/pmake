
export function Group(self, svg) {
    if (typeof(svg.g) === "function") self.set("group", svg.g().append("g"));
    else self.set("group", svg.append("g"));

    self.g = function() {
        return this.get("group");
    }

    self.newLayer = function(name) {
        let layer = this.get("group").append("g");
        layer.attr(name, "");
        this._["layer_" + name] = layer;
        return layer;
    }

    self.layer = function(name) {
        return this._["layer_" + name];
    }

    return self;
}