import { Interp } from "@/Animate/Interp";
import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export function Rect3D(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        width: 1,
        height: 1,
    });

    this._.geometry = new PlaneGeometry(this.vars.width, this.vars.height);
    this._.material = new MeshBasicMaterial({ color: C.black });
    this._.mesh = new Mesh(this._.geometry, this._.material);
    this._.scene.add(this._.mesh);

    this.vars.associate("x", Factory.action(this, this._.mesh.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.mesh.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.mesh.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.mesh.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.mesh.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.mesh.rotation, "z", Interp.numberInterp));
}

Rect3D.prototype = {
    ...BaseThree.prototype,
};
