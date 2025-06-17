import { BaseLight } from "@/Node/Three/Light/BaseLight";

export class HemisphereLight extends BaseLight {
    skyColor(): string;
    skyColor(color: string): this;
    groundColor(): string;
    groundColor(color: string): this;
}
