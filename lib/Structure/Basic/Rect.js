import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Color } from "../../Utility/Color";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";

export function Rect(conf) {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg, "Rect");

    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 40);
    self.set("height", 40);
    self.set("fill", Color.white);
    self.set("fillOpacity", 1);
    self.set("stroke", Color.black);
    self.set("strokeOpacity", 1);
    self.set("strokeWidth", 1);
    self.set("opacity", 1);
    self.set("d3",
        self.get("group").append("rect")
            .attr("x", self.get("x"))
            .attr("y", self.get("y"))
            .attr("width", self.get("width"))
            .attr("height", self.get("height"))
            .attr("fill", self.get("fill"))
            .attr("fill-opacity", self.get("fillOpacity"))
            .attr("stroke", self.get("stroke"))
            .attr("stroke-opacity", self.get("strokeOpacity"))
            .attr("stroke-width", self.get("strokeWidth"))
            .attr("opacity", self.get("opacity")));
    self._.basic = D3Helper.element(self._.d3);
    self._.snap = Snap(self._.basic);
    self = AbsBasic(self);

    if (mode !== "easy") self = Interact(self);

    self.clickable(false);

    
    return self;
}