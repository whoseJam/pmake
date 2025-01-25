import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { Text } from "@/Node/Nake/Text";
import { SDNode } from "@/Node/SDNode";
import { Aside as A } from "@/Rule/Aside";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

function asideRule(element, index, location, gap) {
    A(location + "c", gap + (location === "l" || location === "r") * 3)(element, index);
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

function getElement(parent, location, i) {
    if (Check.isTypeOfGrid(parent)) {
        if (parent.axis() === "row") {
            if (location === "t") {
                for (let rowId = parent.startN(); rowId <= parent.endN(); rowId++) if (parent.endM(rowId) >= i) return parent.element(rowId, i);
                ErrorLauncher.invalidComponentStatus();
            }
            if (location === "b") return parent.element(parent.endN(), i);
            if (location === "l") return parent.element(i, parent.startM());
            if (location === "r") return parent.element(i, parent.endM(i));
        } else {
            if (location === "t") return parent.element(i, parent.startM());
        }
    } else return parent.element(i);
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
    index.effect("fontSize", () => {
        index.vars.elements.forEach(element => {
            element.fontSize(index.fontSize());
        });
    });
    index.effect("index", () => {
        const map = {};
        const gap = index.gap();
        const location = index.location();
        const start = getStart(parent, location);
        const length = getLength(parent, location);
        index.vars.elements.forEach(element => (map[element.intValue()] = element));
        for (let i = start; i < start + length; i++) {
            if (!map[i]) {
                const element = new Text(index, i).opacity(0);
                element.onEnter(EN.appear());
                element.onExit(EX.fade());
                element.triggerEnter(index, () => {
                    index.childAs(element);
                    asideRule(getElement(parent, location, i), element, location, gap);
                    index.vars.elements.push(element);
                });
                element._.updated = true;
            } else delete map[i];
        }
        for (let id in map) {
            const element = map[id];
            index.eraseChild(element);
            index.vars.elements.splice(index.vars.elements.indexOf(element), 1);
        }
        index.vars.elements.forEach(element => {
            const i = element.intValue();
            if (element._.updated) {
                element._.updated = undefined;
                return;
            }
            asideRule(getElement(parent, location, i), element, location, gap);
        });
    });
    parent.childAs(index);
    return index;
}
