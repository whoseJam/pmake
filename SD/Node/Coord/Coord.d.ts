import { Line }   from "@/Node/Nake/Line";
import { Path }   from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";

class SDFunction {
    function(func: (x: number) => number): this;
    coordX(y: number): number;
    coordY(x: number): number;
    trimCoordX(x: number): number;
    trimCoordY(y: number): number;
    globalX(y: number): number;
    globalY(x: number): number;
    trimGlobalX(x: number): number;
    trimGlobalY(y: number): number;
}

export class Coord extends SDNode {
    constructor(parent: SDNode);

    xAxis(): SDNode;
    yAxis(): SDNode;

    viewX(): number;
    viewX(x: number): this;
    viewY(): number;
    viewY(y: number): this;
    viewWidth(): number;
    viewWidth(width: number): this;
    viewHeight(): number;
    viewHeight(height: number): this;

    coordX(x: number): number;
    coordY(y: number): number;
    coordAt(x: number, y: number): [number, number];
    coordAt(v: [number, number]): [number, number];
    globalX(x: number): number;
    globalY(y: number): number;
    globalAt(x: number, y: number): [number, number];
    globalAt(v: [number, number]): [number, number];

    trim(source: [number, number], target: [number, number]): [[number, number], [number, number], boolean];
    trim(source: [number, number], k: number): [[number, number], [number, number], boolean];

    draw(name: number|string, func: (x: number) => number): Path & SDFunction;
    drawLine(name: number|string, k: number, point: [number, number]): Line & SDFunction;
    drawLine(name: number|string, k: number, x: number, y: number): Line & SDFunction;

    at(x: number, y: number): [number, number];
    at(vec: [number, number]): [number, number];
}