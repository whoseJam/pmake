import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Color } from "../../Utility/Color";

export function Rect(conf) {
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
    self.set("width", 40);
    self.set("height", 40);
    self.set("fill", Color.white);
    self.set("fillOpacity", 1);
    self.set("stroke", Color.black);
    self.set("strokeOpacity", 1);
    self.set("strokeWidth", 1);
    self.set("opacity", 1);
    self.set("handle",
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

    self.basic = Basic.basic;
    self.remove = Basic.remove;
    self.transition = Basic.transition;
    self.inRange = Basic.inRange;
    self.x = Basic.x;
    self.y = Basic.y;
    self.width = Basic.width;
    self.height = Basic.height;
    self.fill = Basic.fill;
    self.fillOpacity = Basic.fillOpacity;
    self.stroke = Basic.stroke;
    self.strokeOpacity = Basic.strokeOpacity;
    self.strokeWidth = Basic.strokeWidth;
    self.color = Basic.color;
    self.opacity = Basic.opacity;
    self.clickable = Basic.clickable;
    self.update = Basic.update;
    self.type = () => { return "Rect"; };

    if (mode !== "easy") {
        self = Interact(self);
    }

    self.clickable(false);

    self.g().attr("name", "Rect");
    
    return self;
}