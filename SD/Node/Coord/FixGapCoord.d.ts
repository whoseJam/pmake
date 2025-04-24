import { BaseCoord } from "@/Node/Coord/BaseCoord";

export class FixGapCoord extends BaseCoord {
    gap(by: "x" | "y"): number;
    gap(by: "x" | "y", gap: number): this;
}
