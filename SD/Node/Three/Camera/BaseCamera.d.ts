import { BaseThree } from "@/Node/Three/BaseThree";

export class BaseCamera extends BaseThree {
    resize(width: number, height: number): this;
    lookAt(x: number, y: number, z: number): this;
}
