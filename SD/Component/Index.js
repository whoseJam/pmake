import { Enter as EN } from "@/Node/Core/Enter";
import { effect } from "@/Node/Core/Reactive";
import { Text } from "@/Node/Nake/Text";
import { SDNode } from "@/Node/SDNode";
import { Aside } from "@/Rule/Aside";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

function getBox(parent, location, index, start) {
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

function getStart(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return location === "t" || location === "b" ? parent.startM() : parent.startN();
    } else return parent.start();
}

function getLength(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        return location === "t" || location === "b" ? parent.m() : parent.n();
    } else return parent.length();
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new SDNode(parent);

    index.type("Index");

    index.vars.merge({
        gap: gap,
        location: location,
        fontSize: fontSize,
        elements: [],
    });

    index.gap = Factory.handlerLowPrecise("gap");
    index.location = Factory.handler("location");
    index.fontSize = Factory.handlerLowPrecise("fontSize");

    index._.updater = effect(() => {
        function aside(indexed, attach, location) {
            attach.fontSize(index.fontSize());
            const rule = Aside(location + "c", index.gap() + (location === "l" || location === "r") * 3);
            rule(indexed, attach);
        }
        const map = {};
        const start = getStart(parent, index.location());
        const length = getLength(parent, index.location());
        index.vars.elements.forEach(element => (map[element.intValue()] = element));
        for (let i = start; i < start + length; i++) {
            if (!map[i]) {
                const text = new Text(index, i).opacity(0);
                text.onEnter(EN.appear());
                text.triggerEnter(index, () => {
                    index.childAs(text);
                    const id = text.intValue();
                    const box = getBox(parent, index.location(), id, start);
                    aside(box, text, index.location());
                    index.vars.elements.push(text);
                });
            } else delete map[i];
        }
        for (let id in map) {
            const text = map[id];
            text.onExit(element => element.opacity(0).remove());
            index.eraseChild(text);
            index.vars.elements.splice(index.vars.elements.indexOf(text), 1);
        }

        index.vars.elements.forEach(element => {
            const id = element.intValue();
            const box = getBox(parent, index.location(), id, start);
            aside(box, element, index.location());
        });
    });

    parent.childAs(index);

    return index;
}
