import { Mathjax } from "@/Node/Text/Mathjax";
import { Text } from "@/Node/Nake/Text";

function isMathjax(str) {
    const label = String(str).trim();
    return (label.startsWith("$") && label.endsWith("$") && label.length >= 2);
}

export function Label(parent, text, position = "lc", fontSize = 20, gap = 10) {
    const label = (typeof(text) === "string" || typeof(text) === "number") ?
                    new (isMathjax(text) ? Mathjax : Text)(parent, text) : text;
    label[["height", "fontSize"]["fontSize" in label]](fontSize);

    parent.childAs(`label_${label.text()}`, label, function(parent, child) {
        if (position === "lt")      child.mx(parent.x() - gap).y(parent.y());
        else if (position === "lc") child.mx(parent.x() - gap).cy(parent.cy());
        else if (position === "lb") child.mx(parent.x() - gap).my(parent.my());
        else if (position === "tl") child.my(parent.y() - gap).x(parent.x());
        else if (position === "tc") child.my(parent.y() - gap).cx(parent.cx());
        else if (position === "tr") child.my(parent.y() - gap).mx(parent.mx());
        else if (position === "bl") child.y(parent.my() + gap).x(parent.x());
        else if (position === "bc") child.y(parent.my() + gap).cx(parent.cx());
        else if (position === "br") child.y(parent.my() + gap).mx(parent.mx());
        else if (position === "rt") child.x(parent.mx() + gap).y(parent.y());
        else if (position === "rc") child.x(parent.mx() + gap).cy(parent.cy());
        else if (position === "rb") child.x(parent.mx() + gap).my(parent.my());
        else throw new Error("Invalid Position");
    });
    return label;
}

export function MathjaxLabel(parent, text, position = "lc", fontSize = 20, gap = 10) {
    return Label(node, new Mathjax(parent, text), position, fontSize, gap);
}