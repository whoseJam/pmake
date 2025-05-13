import { BasePath } from "@/Node/Path/BasePath";
import { Path } from "@/Node/Path/Path";
import { BaseShape } from "@/Node/Shape/BaseShape";

export class Vector {
    static add(a: [number, number], b: [number, number]): [number, number];
    static add(a: [number, number, number], b: [number, number, number]): [number, number, number];
    static sub(a: [number, number], b: [number, number]): [number, number];
    static sub(a: [number, number, number], b: [number, number, number]): [number, number, number];
    static dotMul(a: [number, number], b: [number, number]): number;
    static dotMul(a: [number, number, number], b: [number, number, number]): number;
    static numberMul(a: [number, number], b: number): [number, number];
    static numberMul(a: [number, number, number], b: number): [number, number, number];
    static length(a: [number, number]): number;
    static length(a: [number, number, number]): number;
    static identity(a: [number, number]): [number, number];
    static identity(a: [number, number, number]): [number, number, number];
    static complexMul(a: [number, number], b: [number, number]): [number, number];
    static makeComplex(r: number, arc: number): [number, number];
    static rotate(a: [number, number], arc: number): [number, number];
    static norm(a: [number, number]): [number, number];
    static norm(a: [number, number, number]): [number, number, number];
    static cross(a: [number, number], b: [number, number]): number;
    static onLeft(a: [number, number], b: [number, number]): boolean;
    static onRight(a: [number, number], b: [number, number]): boolean;
    static cos(a: [number, number]): number;
    static sin(a: [number, number]): number;
    static tan(a: [number, number]): number;
    static cohenSutherland(a: [number, number], b: [number, number], x: number, y: number, width: number, height: number): [[number, number], [number, number]] | undefined;
    static intersectRayWithSegment(point: [number, number], direction: [number, number], a: [number, number], b: [number, number]): [number, number] | undefined;
    static intersectRayWithBox(point: [number, number], direction: [number, number], x: number, y: number, width: number, height: number): Array<[number, number]> | undefined;

    static polyIntersect(...polygons: BaseShape | BasePath): Path;
    static polyIntersect(polygons: Array<BaseShape | BasePath>): Path;
    static polyUnion(...polygons: BaseShape | BasePath): Path;
    static polyUnion(polygons: Array<BaseShape | BasePath>): Path;
}

export function vec(): typeof Vector;
