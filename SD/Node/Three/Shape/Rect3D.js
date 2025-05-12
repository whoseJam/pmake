import { Interp } from "@/Animate/Interp";
import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { BufferGeometry, DoubleSide, LineBasicMaterial, Line as LineFromThree, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";

export function Rect3D(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        width: 1,
        height: 1,
    });

    this._.fillGeometry = new PlaneGeometry(this.vars.width, this.vars.height);
    this._.fillMaterial = new MeshBasicMaterial({ color: C.green, side: DoubleSide });
    this._.fill = new Mesh(this._.fillGeometry, this._.fillMaterial);
    this._.strokeGeometry = new BufferGeometry().setFromPoints([
        // format
        new Vector3(-0.5, -0.5, 0),
        new Vector3(-0.5, 0.5, 0),
        new Vector3(0.5, 0.5, 0),
        new Vector3(0.5, -0.5, 0),
        new Vector3(-0.5, -0.5, 0),
    ]);
    this._.strokeMaterial = new LineBasicMaterial({ color: C.black, side: DoubleSide });
    this._.stroke = new LineFromThree(this._.strokeGeometry, this._.strokeMaterial);
    this._.scene.add(this._.fill);
    this._.scene.add(this._.stroke);

    this.vars.associate("x", Factory.action(this, this._.fill.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.fill.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.fill.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.fill.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.fill.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.fill.rotation, "z", Interp.numberInterp));
}

Rect3D.prototype = {
    ...BaseThree.prototype,
};
