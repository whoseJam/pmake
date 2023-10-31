import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Path } from "../Basic/Path";
import * as Rule from "../../Rule/Rule";

export function Curve(node) {
    let self = {};

    self = Node(self, node);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));

    let background = Path(self.layer("background"));
    self.children.push("background", background)
    
    self._.x1 = 0;
    self._.y1 = 0;
    self._.x2 = 100;
    self._.y2 = 0;
    
    self.type = function() {
        return "Curve";
    }

    self.g().attr("name", "Curve");

    return self;
}

function at(k) {
}