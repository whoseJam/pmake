import * as Basic from "./Basic";
import { Node } from "../../Node/Node_";
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
    self = Node(self, svg, "Image");
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

    if (mode !== "easy") self = Interact(self);

    self.clickable(false);

    return self;
}

function ref(url) {
    if (url === undefined)
        return this.get("href");
    this.set("href", url);
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "href",
            value: url
        })
    );
    return this;
}
