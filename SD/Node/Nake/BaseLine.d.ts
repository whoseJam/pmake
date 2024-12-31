import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";

export class BaseLine extends BaseNake {
    constructor(parent: SDNode, tag: string);

    markerStart(): string;
    markerStart(marker: string): this;
    markerMid(): string;
    markerMid(marker: string): this;
    markerEnd(): string;
    markerEnd(marker: string): this;

    arrow(flag: boolean | undefined | null): this;
    revArrow(flag: boolean | undefined | null): this;
    doubleArrow(flag: boolean | undefined | null): this;

    pointStoT(): this;
    pointTtoS(): this;
    fadeStoT(): this;
    fadeTtoS(): this;

    source(): [number, number];
    source(vector: [number, number]): this;
    source(x: number, y: number): this;

    target(): [number, number];
    target(vector: [number, number]): this;
    target(x: number, y: number): this;

    x1(): number;
    x1(x: number): this;
    x2(): number;
    x2(x: number): this;
    y1(): number;
    y1(y: number): this;
    y2(): number;
    y2(y: number): this;

    at(k: number): Vector;
    getPointAtLength(length: number): Vector;
    totalLength(): number;

    text(): string;
    drop(): this;
    intValue(): number;
    value(): SDNode;
    value(value: SDNode): this;
    value(value: SDNode, rule: SDRule): this;
    valueFromExist(value: SDNode): this;
    valueFromExist(value: SDNode, rule: SDRule): this;
}
