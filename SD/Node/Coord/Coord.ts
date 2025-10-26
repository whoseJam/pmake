import { Axis } from "@/Node/Axis/Axis";
import { CartesianCoord } from "@/Node/Coord/CartesianCoord";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Coord extends CartesianCoord<Axis> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Coord");

        this.childAs("x", new Axis(this).direction(1, 0).withTickLabel(true), (parent, child: Axis) => {
            if (this.origin() === "bl") child.source(parent.pos("x", "my"));
            else if (this.origin() === "c") child.source(parent.pos("x", "cy"));
            child.length(parent.width());
        });
        this.childAs(
            "y",
            new Axis(this).direction(0, -1).withTickLabel(true).tickLabelAlign("target"),
            (parent, child: Axis) => {
                if (this.origin() === "bl") child.source(parent.pos("x", "my"));
                else if (this.origin() === "c") child.source(parent.pos("cx", "my"));
                child.length(parent.height());
            }
        );
    }
}
