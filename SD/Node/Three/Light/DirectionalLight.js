import { Interp } from "@/Animate/Interp";
import { BaseLight } from "@/Node/Three/Light/BaseLight";
import { Factory } from "@/Utility/Factory";
import { DirectionalLight as DirectionalLightFromThree } from "three";

export function DirectionalLight(target) {
    BaseLight.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
    });

    this._.light = new DirectionalLightFromThree(this.vars.color);
    this._.scene.add(this._.light);

    this.vars.watch("x", Factory.action(this, this._.light.position, "x", Interp.numberInterp));
    this.vars.watch("y", Factory.action(this, this._.light.position, "y", Interp.numberInterp));
    this.vars.watch("z", Factory.action(this, this._.light.position, "z", Interp.numberInterp));
    this.vars.watch("rx", Factory.action(this, this._.light.rotation, "x", Interp.numberInterp));
    this.vars.watch("ry", Factory.action(this, this._.light.rotation, "y", Interp.numberInterp));
    this.vars.watch("rz", Factory.action(this, this._.light.rotation, "z", Interp.numberInterp));
    this.vars.watch("color", Factory.action(this, this._.light, "color", Interp.normalizedColorInterp));
    this.vars.watch("intensity", Factory.action(this, this._.light, "intensity", Interp.numberInterp));
}

DirectionalLight.prototype = {
    ...BaseLight.prototype,
};
