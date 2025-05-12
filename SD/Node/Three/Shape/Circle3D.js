import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { BufferGeometry, CircleGeometry, DoubleSide, LineBasicMaterial, Line as LineFromThree, Mesh, MeshBasicMaterial, Vector3 } from "three";

function getPolygonVertices(radius = 0.5) {
    const count = 128;
    const vertices = [];
    for (let i = 0; i <= count; i++) {
        const v = new Vector3(
            // format
            radius * Math.sin((2 * i * Math.PI) / count),
            radius * Math.cos((2 * i * Math.PI) / count),
            0
        );
        vertices.push(v);
    }
    return vertices;
}

export function Circle3D(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        r: 0.5,
    });

    this._.fillGeometry = new CircleGeometry(this.vars.r, 128);
    this._.fillMaterial = new MeshBasicMaterial({ color: C.grey, side: DoubleSide });
    this._.fill = new Mesh(this._.fillGeometry, this._.fillMaterial);
    this._.strokeGeometry = new BufferGeometry().setFromPoints(getPolygonVertices());
    this._.strokeMaterial = new LineBasicMaterial({ color: C.black, side: DoubleSide });
    this._.stroke = new LineFromThree(this._.strokeGeometry, this._.strokeMaterial);
    this._.scene.add(this._.fill);
    this._.scene.add(this._.stroke);
}

Circle3D.prototype = {
    ...BaseThree.prototype,
};
