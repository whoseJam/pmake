import { Color as C } from "@/Utility/Color";
import * as THREE from "three";

export class Cube {
    constructor() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshToonMaterial({ color: C.pureGreen });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    getAttribute(key) {
        if (key === "x" || key === "y" || key === "z") {
            return this.mesh.position[key];
        } else if (key === "rx" || key === "ry" || key === "rz") {
            return this.mesh.rotation[key.slice(1)];
        } else if (key === "color") {
            return this.material.color;
        }
    }
    setAttribute(key, value) {
        if (key === "x" || key === "y" || key === "z") {
            this.mesh.position[key] = value;
        } else if (key === "rx" || key === "ry" || key === "rz") {
            this.mesh.rotation[key.slice(1)] = value;
        } else if (key === "color") {
            this.material.color = { r: value.r / 256, g: value.g / 256, b: value.b / 256 };
        }
    }
}
