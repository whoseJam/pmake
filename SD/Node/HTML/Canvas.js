
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";
import { Interp } from "@/Animate/Interp";

export function Canvas(parent) {
    BaseHTML.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        width: 400,
        height: 300
    });

    this._.layer.setAttribute("width", "400px");
    this._.layer.setAttribute("height", "300px");
    this._.nake = createRenderNode(this, this._.layer, "canvas");
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    
    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
}

Canvas.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};
