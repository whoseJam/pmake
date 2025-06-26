import { Interp } from "@/Animate/Interp";
import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";
import { Factory } from "@/Utility/Factory";
import { PerspectiveCamera as PerspectiveCameraFromThree } from "three";

export function PerspectiveCamera(target) {
    BaseCamera.call(this, target);

    this.vars.merge({
        fov: 75,
        aspect: 400 / 300,
    });

    this._.camera = new PerspectiveCameraFromThree(this.vars.fov, this.vars.aspect, this.vars.near, this.vars.far);
    this._.camera.position.set(this.vars.x, this.vars.y, this.vars.z);
    this._.camera.lookAt(0, 0, 0);

    this.vars.watch("x", Factory.action(this, this._.camera.position, "x", Interp.numberInterp));
    this.vars.watch("y", Factory.action(this, this._.camera.position, "y", Interp.numberInterp));
    this.vars.watch("z", Factory.action(this, this._.camera.position, "z", Interp.numberInterp));
    this.vars.watch("rx", Factory.action(this, this._.camera.rotation, "x", Interp.numberInterp));
    this.vars.watch("ry", Factory.action(this, this._.camera.rotation, "y", Interp.numberInterp));
    this.vars.watch("rz", Factory.action(this, this._.camera.rotation, "z", Interp.numberInterp));
    this.vars.watch("fov", Factory.action(this, this._.camera, "fov", Interp.numberInterp));
    this.vars.watch("aspect", Factory.actionForCamera(this, this._.camera, "aspect", Interp.numberInterp));
    this.vars.watch("near", Factory.action(this, this._.camera, "near", Interp.numberInterp));
    this.vars.watch("far", Factory.action(this, this._.camera, "far", Interp.numberInterp));
}

PerspectiveCamera.prototype = {
    ...BaseCamera.prototype,
    aspect: Factory.handlerMediumPrecise("aspect"),
    resize(width, height) {
        this.aspect(width / height);
        return this;
    },
};
