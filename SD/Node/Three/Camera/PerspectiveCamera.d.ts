import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";

export class PerspectiveCamera extends BaseCamera {
    fov(): number;
    fov(fov: number): this;
    aspect(): number;
    aspect(aspect: number): this;
    near(): number;
    near(near: number): this;
    far(): number;
    far(far: number): this;
}
