import { SDNode } from "@/Node/SDNode";

interface ArrayLayoutParam {
    x: number;
    y: number;
    elementWidth: number;
    elementHeight: number;
}

export function ArrayLayout(arr: Array<SDNode>, args: ArrayLayoutParam) {}
