import { Mathjax } from "@/Node/Text/Mathjax";
import { Text } from "@/Node/Nake/Text";
import { SDNode } from "@/Node/SDNode";

function isMathjax(str) {
    const label = String(str).trim();
    return (label.startsWith("$") && label.endsWith("$") && label.length >= 2);
}

function LabelRule(parent, child) {
    const location = child.member.getAndFlush("location");
    const gap = child.member.getAndFlush("labelGap");
    if (location === "lt")      child.mx(parent.x() - gap).y(parent.y());
    else if (location === "lc") child.mx(parent.x() - gap).cy(parent.cy());
    else if (location === "lb") child.mx(parent.x() - gap).my(parent.my());
    else if (location === "tl") child.my(parent.y() - gap).x(parent.x());
    else if (location === "tc") child.my(parent.y() - gap).cx(parent.cx());
    else if (location === "tr") child.my(parent.y() - gap).mx(parent.mx());
    else if (location === "bl") child.y(parent.my() + gap).x(parent.x());
    else if (location === "bc") child.y(parent.my() + gap).cx(parent.cx());
    else if (location === "br") child.y(parent.my() + gap).mx(parent.mx());
    else if (location === "rt") child.x(parent.mx() + gap).y(parent.y());
    else if (location === "rc") child.x(parent.mx() + gap).cy(parent.cy());
    else if (location === "rb") child.x(parent.mx() + gap).my(parent.my());
}

export function Label(parent, text, location = "lc", fontSize = 20, gap = 10) {
    const label = (typeof(text) === "string" || typeof(text) === "number") ?
                    new (isMathjax(text) ? Mathjax : Text)(parent, text) : text;
    label["fontSize" in label ? "fontSize": "height"](fontSize);

    label.attachUpdate(() => {
        if (label.member.hasChanged("location") ||
            label.member.hasChanged("labelGap")) {
            label.triggerRule();
        }
    });

    label.member.new("location", location);
    label.member.new("labelGap", gap);

    label.location = SDNode.OrdinaryGSet("location", "set");
    label.gap = SDNode.OrdinaryGSet("labelGap", "setByDqual");

    parent.childAs(`label_${label.text()}`, label, LabelRule);

    return label;
}

export function MathjaxLabel(parent, text, location = "lc", fontSize = 20, gap = 10) {
    return Label(parent, new Mathjax(parent, text), location, fontSize, gap);
}