import { FixGapAxis } from "@/Node/Axis/FixGapAxis";
import { CartesianCoord } from "@/Node/Coord/CartesianCoord";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class FixGapCoord extends CartesianCoord<FixGapAxis> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("FixGapCoord");

        this.childAs(
            "y",
            new FixGapAxis(this).direction(0, -1).withTickLabel(true).tickLabelAlign("target"),
            (parent, child) => {
                if (this.origin() === "bl") child.source(parent.pos("x", "my"));
                else if (this.origin() === "c") child.source(parent.pos("cx", "my"));
            }
        );
        this.childAs("x", new FixGapAxis(this).direction(1, 0).withTickLabel(true), (parent, child) => {
            if (this.origin() === "bl") child.source(parent.pos("x", "my"));
            else if (this.origin() === "c") child.source(parent.pos("x", "cy"));
        });
    }

    gap(by: "x" | "y"): number;
    gap(by: "x" | "y", gap: number): this;
    gap(by: "x" | "y", gap?: number) {
        if (arguments.length === 1) return this.axis(by).gap();
        this.axis(by).gap(gap!);
        return this;
    }

    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.axis("x").length();
        this.axis("x").length(width!);
        return this;
    }

    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.axis("y").length();
        this.axis("y").length(height!);
        return this;
    }
}
