import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { Text } from "@/Node/Nake/Text";
import { Aside } from "@/Rule/Aside";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

let indexID = 0;

function GetIndexedBox(parent, location, index, start) {
    const x = parent.x();
    const y = parent.y();
    const elementWidth = parent.elementWidth();
    const elementHeight = parent.elementHeight();
    let minX = location === "t" || location === "b" ? x + elementWidth * (index - start) : x;
    if (Check.isTypeOfGrid(parent) && location === "r") minX = x + elementWidth * (parent.m() - 1);
    let minY = location === "l" || location === "r" ? y + elementHeight * (index - start) : y;
    if (Check.isTypeOfGrid(parent) && location === "b") minY = y + elementHeight * (parent.n() - 1);
    return {
        x: () => minX,
        cx: () => minX + elementWidth / 2,
        mx: () => minX + elementWidth,
        y: () => minY,
        cy: () => minY + elementHeight / 2,
        my: () => minY + elementHeight,
    };
}

function GetIndexStart(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return location === "t" || location === "b" ? parent.startM() : parent.startN();
    } else return parent.start();
}

function GetIndexLength(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return location === "t" || location === "b" ? parent.m() : parent.n();
    } else return parent.length();
}

function IndexRule(parent, index) {
    const gap = index.gap();
    const location = index.location();
    const fontSize = index.fontSize();
    const length = GetIndexLength(parent, location);
    const start = GetIndexStart(parent, location);

    function aside(indexed, attach, location) {
        attach.fontSize(fontSize);
        const rule = Aside(location + "c", gap + (location === "l" || location === "r") * 3);
        rule(indexed, attach);
    }

    const indexes = {};
    const elements = index.vars.elements;
    elements.forEach(element => {
        indexes[element.intValue()] = element;
    });

    // Add
    for (let i = start; i < start + length; i++) {
        if (!indexes[i]) {
            const text = new Text(index, i);
            text.onEnter(EN.appear("elements"));
            index.insertByBaseArray(0, text);
        } else delete indexes[i];
    }
    // Delete
    for (let i in indexes) {
        const text = indexes[i];
        text.onExit(element => element.opacity(0).remove());
        index.eraseChild(text);
        elements.splice(elements.indexOf(text), 1);
    }

    elements.forEach(element => {
        const id = element.intValue();
        const box = GetIndexedBox(parent, location, id, start);
        aside(box, element, location);
    });
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new BaseArray(parent);

    index.vars.merge({
        gap: gap,
        location: location,
        fontSize: fontSize,
    });

    index.gap = Factory.handlerLowPrecise("gap");
    index.location = Factory.handler("location");
    index.fontSize = Factory.handlerLowPrecise("fontSize");

    parent.childAs(`index_${++indexID}`, index, IndexRule);

    return index;
}
