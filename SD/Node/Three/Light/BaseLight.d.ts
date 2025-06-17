import { BaseThree } from "@/Node/BaseThree";

export class BaseLight extends BaseThree {
    color(): string;
    color(color: string): this;
    intensity(): number;
    intensity(intentsity: number): this;
}
