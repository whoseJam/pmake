import { Text }            from "@/Node/Nake/Text";
import { Enter }           from "@/Node/SDNode/Enter";
import { Aside }           from "@/Rule/Aside";
import { BaseArray }       from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

import { Check } from "@/Utility/Check";

let indexID = 0;

function GetIndexedBox(parent, location, index, start) {
    const x = parent.x();
    const y = parent.y();
    const elementWidth = parent.elementWidth();
    const elementHeight = parent.elementHeight();
    let minX = (location === "t" || location === "b") ? x + elementWidth * (index - start) : x;
    if (Check.isTypeOfGrid(parent) && location === "r") minX = x + elementWidth * (parent.m() - 1);
    let minY = (location === "l" || location === "r") ? y + elementHeight * (index - start) : y;
    if (Check.isTypeOfGrid(parent) && location === "b") minY = y + elementHeight * (parent.n() - 1);
    return {
        x: () => minX,
        cx: () => minX + elementWidth / 2,
        mx: () => minX + elementWidth,
        y: () => minY,
        cy: () => minY + elementHeight / 2,
        my: () => minY + elementHeight
    }
}

function GetIndexStart(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return (location === "t" || location === "b") ? parent.startM() : parent.startN();
    } else return parent.start();
}

function GetIndexLength(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return (location === "t" || location === "b") ? parent.m() : parent.n();
    } else return parent.length();
}

function IndexRule(parent, child) {
    const location = child.member.get("location");
    child.member.set("indexLength", GetIndexLength(parent, location));
    child.member.set("indexStart", GetIndexStart(parent, location));
    function aside(indexed, attach, location, fontSize, gap) {
        attach.fontSize(fontSize);
        const rule = Aside(location + "c", gap + (location === "l" || location === "r") * 3);
        rule(indexed, attach);
    }
    if (child.member.hasChanged("indexLength") ||
        child.member.hasChanged("indexStart") ||
        child.member.hasChanged("location") ||
        child.member.hasChanged("fontSize") ||
        child.member.hasChanged("indexGap")) {
        const length = child.member.getAndFlush("indexLength");
        const start = child.member.getAndFlush("indexStart");
        const location = child.member.getAndFlush("location");
        const dict = {};
        const elements = child.member.getAndFlush("elements");
        const fontSize = child.member.getAndFlush("fontSize");
        const gap = child.member.getAndFlush("indexGap");
        for (let i = 0; i < elements.length; i++)
            dict[elements[i].intValue()] = elements[i];
        for (let i = start; i < start + length; i++) {
            const indexed = GetIndexedBox(parent, location, i, start);
            if (!dict[i]) {
                const attach = new Text(child, i).fontSize(fontSize);
                attach.onEnter(Enter.ordinary(child));
                elements.push(attach);
                child._.children.push(attach);
                child.tryMove(attach, () => {
                    aside(indexed, attach, location, fontSize, gap);
                });
            } else {
                const attach = dict[i];
                child.tryMove(attach, () => {
                    aside(indexed, attach, location, fontSize, gap);
                })
                delete dict[i];
            }
        }
        for (let idx in dict) {
            const attach = dict[idx];
            child._.children.erase(attach);
            elements.splice(elements.indexOf(attach), 1);
            attach.opacity(0).remove();
        }
    }
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new BaseArray(parent);

    index.attachUpdate(() => {
        index.triggerRule();
    })

    index.member.new("indexLength", undefined);
    index.member.new("indexStart", undefined);
    index.member.new("location", location);
    index.member.new("fontSize", fontSize);
    index.member.new("indexGap", gap);

    index.location = SDNode.OrdinaryGSet("location", "set");
    index.fontSize = SDNode.OrdinaryGSet("fontSize", "setByDqual");
    index.gap = SDNode.OrdinaryGSet("indexGap", "setByDqual");

    parent.childAs(`index_${++indexID}`, index, IndexRule);

    return index;
}