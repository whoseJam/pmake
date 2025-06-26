import { SD2DNode } from "@/Node/SD2DNode";
import { Factory } from "@/Utility/Factory";
import React from "react";
import { BaseSVG } from "../SVG/BaseSVG";

global.React = React;

export class BaseHTML extends SD2DNode {
    constructor(target, label) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
            fill: C.white,
            stroke: C.black,
            strokeWidth: 1,
        });

        this._.layer.setAttribute("position", "absolute");
        this._.layer.setAttribute("pointer-events", "auto");
        this._.layer.setAttribute("left", 0);
        this._.layer.setAttribute("top", 0);

        this._.nake = createRenderNode(this, this._.layer, label);
        this._.nake.setAttribute("width", "100%");
        this._.nake.setAttribute("height", "100%");
        this._.nake.setAttribute("border-style", "solid");
        this._.nake.setAttribute("border-width", `${this.vars.strokeWidth}px`);
        this._.nake.setAttribute("border-color", this.vars.stroke);
        this._.nake.setAttribute("background-color", this.vars.fill);
        this.vars.watch("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
        this.vars.watch("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
        this.vars.watch("fill", Factory.action(this, this._.nake, "background-color", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, this._.nake, "border-color", Interp.colorInterp));
    }
}

Object.assign(BaseHTML.prototype, {
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color: BaseSVG.prototype.color,
});
