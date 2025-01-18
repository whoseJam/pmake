import * as THREE from "three";

export class Three {
    constructor() {
        this.frustumSize = 6;
        this.scene = new THREE.Scene();
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera((this.frustumSize * aspect) / -2, (this.frustumSize * aspect) / 2, this.frustumSize / 2, this.frustumSize / -2, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            precision: "highp",
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff, 0);
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(0, 10, 10);
        this.scene.add(this.light);
        this.renderer.setAnimationLoop(() => this.renderer.render(this.scene, this.camera));
    }
    dom() {
        return this.renderer.domElement;
    }
    append(child) {
        this.scene.add(child.mesh);
    }
    getAttribute(key) {
        if (key === "opacity") {
            return this.dom().style[key];
        }
    }
    setAttribute(key, value) {
        if (key === "opacity") {
            this.dom().style[key] = value;
        }
    }
}
