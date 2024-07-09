import { SDNode } from "SD/Node/SDNode";

interface StressType extends SDNode {
    stress(): this;
}

export function Stress(parent: any): StressType;