import { Text } from "../slide";

export function Label(node, name, position="lc", fontSize=20) {
    let label = new Text(node, name).fontSize(fontSize);
    node.childAs(`label_${name}`, label, function(parent, child) {
        if (position === "lt") child.mx(parent.x() - 10).y(parent.y());
        else if (position === "lc") child.mx(parent.x() - 10).cy(parent.cy());
        else if (position === "lb") child.mx(parent.x() - 10).my(parent.my());
        else if (position === "tl") child.my(parent.y() - 10).x(parent.x());
        else if (position === "tc") child.my(parent.y() - 10).cx(parent.cx());
        else if (position === "tr") child.my(parent.y() - 10).mx(parent.mx());
        else if (position === "bl") child.y(parent.my() + 10).x(parent.x());
        else if (position === "bc") child.y(parent.my() + 10).cx(parent.cx());
        else if (position === "br") child.y(parent.my() + 10).mx(parent.mx());
    });
}