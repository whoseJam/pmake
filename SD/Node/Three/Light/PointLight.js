import { Interp } from "@/Animate/Interp";
import { Factory } from "@/Utility/Factory";
import { PointLight as PointLightFromThree } from "three";
import { BaseLight } from "./BaseLight";

export function PointLight(target) {
    BaseLight.prototype.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        distance: 0,
        decay: 2,
    });

    this._.light = new PointLightFromThree(this.vars.color, this.vars.intensity);
    this._.scene.add(this._.light);

    this.vars.watch("x", Factory.action(this, this._.light.position, "x", Interp.numberInterp));
    this.vars.watch("y", Factory.action(this, this._.light.position, "y", Interp.numberInterp));
    this.vars.watch("z", Factory.action(this, this._.light.position, "z", Interp.numberInterp));
    this.vars.watch("color", Factory.action(this, this._.light, "color", Interp.normalizedColorInterp));
    this.vars.watch("intensity", Factory.action(this, this._.light, "intensity", Interp.numberInterp));
    this.vars.watch("distance", Factory.action(this, this._.light, "distance", Interp.numberInterp));
    this.vars.watch("decay", Factory.action(this, this._.light, "decay", Interp.numberInterp));
}

PointLight.prototype = {
    ...BaseLight.prototype,
    color: Factory.handler("color"),
    intensity: Factory.handlerMediumPrecise("intensity"),
    distance: Factory.handlerLowPrecise("distance"),
    decay: Factory.handlerLowPrecise("decay"),
};
