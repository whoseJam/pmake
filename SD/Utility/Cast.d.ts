import { SDNode } from "@/Node/SDNode";

export class Cast {
    static castToSDNode(target: SDNode, object: any, id?: number): SDNode;
    static castToArray(any: any): Array;
    static castPointsToBox(points: Array<[number, number]>): { x: number; y: number; width: number; height: number };
}
