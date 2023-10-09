import * as d3 from "d3";

export function Draggable(self) {
    self._.dragging = null;
    self._.dragFlag = false;

    self.listen("onActivate", onActivate);
    self.listen("onDeactivate", onDeactivate);

    self.drag = drag;

    return self;
}

function drag(flag) {
    if (flag === undefined)
        return this._.dragFlag;
    this._.dragFlag = flag;
    this.overlay(flag ? 1 : -1);
    if (typeof(flag) === "object" && flag !== null) {
        let d3drag = d3.drag();
        d3drag.on("start", flag["start"]);
        d3drag.on("drag", flag["drag"]);
        d3drag.on("end", flag["end"]);
        this.set("dragging", d3drag, true);
    } else if (typeof(flag) === "function") {
        let d3drag = d3.drag();
        this.set("dragging", d3drag.on("drag", flag), true);
    } else if (flag) {
        let d3drag = d3.drag(), self = this;
        d3drag.on("drag", function(e) {
            self.dx(e.dx);
            self.dy(e.dy);
        });
        this.set("dragging", d3drag, true);
    } else {
        this.set("dragging", null, true);
    }
    if (this.isActivated())
        this.call("onActivate");
    return this;
}

function onActivate() {
    let overlay = this.get("overlay");
    if (this.get("dragging")) {
        overlay.basic().call(this.get("dragging"));
        overlay.g().style("cursor", "move");
    }
}

function onDeactivate() {
    let overlay = this.get("overlay");
    overlay.basic().call(d3.drag());
    overlay.g().style("cursor", "");
}