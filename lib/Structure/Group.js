import { Node } from "../Node/Node_";

export function Group(node) {
    let self = {};

    self = Node(self, node);

    self.set("elements", []);

    self.extWidth = () => {};
    self.extHeight = () => {};

    self.push = push;

    return self;
}

function push(elem) {
    let elems = this.get("elements");
    elems.push(elem);
}
