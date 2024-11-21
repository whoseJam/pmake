import { Text }      from "@/Node/Nake/Text";
import { Enter }     from "@/Node/SDNode/Enter";
import { SDNode }    from "@/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

import { Aside } from "@/Rule/Aside";

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

function IndexRule(parent, index) {
    const location = index.member.get("location");
    index.member.set("index-length", GetIndexLength(parent, location));
    index.member.set("index-start", GetIndexStart(parent, location));
    
    function aside(indexed, attach, location, fontSize, gap) {
        attach.fontSize(fontSize);
        const rule = Aside(location + "c", gap + (location === "l" || location === "r") * 3);
        rule(indexed, attach);
    }

    if (index.member.hasChanged("index-length") ||
        index.member.hasChanged("index-start")) {
        const indexes  = {};
        const start    = index.member.getAndFlush("index-start");
        const length   = index.member.getAndFlush("index-length");
        const elements = index.member.getAndFlush("elements");

        elements.forEach((element) => {
            indexes[element.intValue()] = element;
        });

        // Add
        for (let i = start; i < start + length; i++) {
            if (!indexes[i]) {
                const text = new Text(index, i);
                text.onEnter(Enter.ordinary(index));
                elements.push(text);
                index.childAs(text);
                if (index.updating()) text.freeze();
            } else delete indexes[i];
        }
        // Delete
        for (let i in indexes) {
            const text = indexes[i];
            text.onExit(element => element.opacity(0).update().remove());
            index.eraseChild(text);
            elements.splice(elements.indexOf(text), 1);
        }
    }
    if (true) {
        const gap      = index.member.getAndFlush("index-gap");
        const start    = index.member.getAndFlush("index-start");
        const elements = index.member.getAndFlush("elements");
        const fontSize = index.member.getAndFlush("font-size");
        elements.forEach(element => {
            index.tryMove(element, () => {
                const id = element.intValue();
                const box = GetIndexedBox(parent, location, id, start);
                aside(box, element, location, fontSize, gap);
            });
        });
    }
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new BaseArray(parent);

    index.attachUpdate(() => {
        index.triggerRule();
    });

    index.member.new("index-gap", gap);
    index.member.new("index-start", undefined);
    index.member.new("index-length", undefined);
    index.member.new("location", location);
    index.member.new("font-size", fontSize);

    index.gap      = SDNode.OrdinaryGSet("index-gap", "setByDqual");
    index.location = SDNode.OrdinaryGSet("location", "set");
    index.fontSize = SDNode.OrdinaryGSet("font-size", "setByDqual");
    
    parent.childAs(`index_${++indexID}`, index, IndexRule);

    return index;
}