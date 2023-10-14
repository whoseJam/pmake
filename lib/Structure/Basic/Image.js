import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";

export function Image(conf) {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg);
    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 50);
    self.set("height", 50);
    self.set("opacity", 1);
    self.set("aspect", null);
    self.set("href", "");
    self.set("d3",
        self.get("group").append("image")
            .attr("x", self.get("x"))
            .attr("y", self.get("y"))
            .attr("width", self.get("width"))
            .attr("height", self.get("height"))
            .attr("opacity", self.get("opacity")));
    self._.basic = D3Helper.element(self._.d3);
    self._.snap = Snap(self._.basic);
    self = AbsBasic(self);
    
    self.ref = ref;
    self.type = () => { return "Image"; };

    if (mode !== "easy") self = Interact(self);

    self.clickable(false);

    self.g().attr("name", "Image");

    return self;
}

function ref(url) {
    if (typeof(url) === "undefined")
        return this.get("href");
    this.set("href", url);
    // Basic.prop.call(this, "attr", ["xlink:href", url], "attr.xlink:href");
    return this;
}
