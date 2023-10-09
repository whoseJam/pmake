
export function Group(self, svg) {
    if (typeof(svg.g) === "function") self.set("group", svg.g().append("g"));
    else self.set("group", svg.append("g"));
    
    self.g = function() {
        return self.get("group");
    }

    self.newLayer = function(name) {
        let layer = self.get("group").append("g");
        layer.attr("name", name);
        self.set("layer_" + name, layer);
        return layer;
    }

    self.layer = function(name) {
        return self.get("layer_" + name);
    }

    return self;
}