import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { AbsBasic } from "./Basic";

export function Image(conf) {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg);
    self = AbsBasic(self);

    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 50);
    self.set("height", 50);
    self.set("opacity", 1);
    self.set("aspect", null);
    self.set("href", "");
    self.set("handle",
        self.get("group").append("image")
            .attr("x", self.get("x"))
            .attr("y", self.get("y"))
            .attr("width", self.get("width"))
            .attr("height", self.get("height"))
            .attr("opacity", self.get("opacity")));
    
    self.basic = Basic.basic;
    self.remove = Basic.remove;
    self.transition = Basic.transition;
    self.inRange = Basic.inRange;
    self.x = Basic.x;
    self.y = Basic.y;
    self.width = Basic.width;
    self.height = Basic.height;
    self.opacity = Basic.opacity;
    self.clickable = Basic.clickable;
    self.ref = ref;
    self.update = Basic.update;
    self.type = () => { return "Image"; };

    if (mode !== "easy") {
        self = Interact(self);
    }

    self.clickable(false);

    self.g().attr("name", "Image");

    return self;
}

function ref(url) {
    if (typeof(url) === "undefined")
        return this.get("href");
    this.set("href", url);
    Basic.prop.call(this, "attr", ["xlink:href", url], "attr.xlink:href");
    return this;
}
