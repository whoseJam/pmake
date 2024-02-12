import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { Svg2Path } from "../../Utility/Svg2Path";
import { Node } from "../../Node/Node_";
import { Manager } from "../../Animate/Manager";
import { timeout } from "d3";
import { make1d, make2d } from "../../slide";
import { SDHelper } from "../../Utility/SDHelper";
import { D3Helper } from "../../Utility/D3Helper";

export function Mathjax(node) {
    let self = {};
    self = Node(self, node, "Mathjax");
    self = Interact(self);
    self.x = x;
    self.y = y;
}