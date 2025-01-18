import { Interp } from "@/Animate/Interp";
import { three } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function Cube(parent) {
    SDNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        color: C.pureGreen,
    });

    this._.nake = createRenderNode(this, three(), "cube");

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.nake, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.nake, "rx", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.nake, "ry", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.nake, "rz", Interp.numberInterp));
    this.vars.associate("color", Factory.action(this, this._.nake, "color", Interp.colorInterp));
}

Cube.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    z: Factory.handlerLowPrecise("z"),
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    rz: Factory.handlerLowPrecise("rz"),
    color: Factory.handler("color"),
};
