import { Box } from "@/Node/Element/Box";
import { Tree } from "@/Node/Tree/Tree";

export class BoxTree extends Tree<Box> {
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
