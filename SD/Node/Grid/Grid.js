import { Box } from "@/Node/Element/Box";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { Exit as EX } from "@/Node/SDNode/Exit";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function Grid(parent) {
    BaseGrid.call(this, parent);

    this.type("Grid");
    this.newLayer("elements");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40,
        width: 0,
        height: 0,
        main: "row",
        align: "x",
    });

    this._.updater = effect(() => {
        const dict = {
            x: this.x(),
            y: this.y(),
            mx: this.mx(),
            my: this.my(),
            lx: this.elementWidth(),
            ly: this.elementHeight(),
        };
        const elements = this.vars.elements;
        const main = this.axis();
        const align = this.align();
        const mainAxis = main === "row" ? "y" : "x";
        const auxiAxis = main === "row" ? "x" : "y";
        const auxiFlag = align === "x" || align === "y" ? 1 : -1;
        const auxiLabel = align === "x" || align === "y" ? auxiAxis : `m${auxiAxis}`;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                element.width(dict["lx"]);
                element.height(dict["ly"]);
                element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
                element[auxiLabel](dict[auxiLabel] + auxiFlag * j * dict[`l${auxiAxis}`]);
            }
        }
    });
}

Grid.prototype = {
    ...BaseGrid.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    axis: Factory.handlerLowPrecise("main"),
    align: Factory.handlerLowPrecise("align"),
    width: function (width) {
        const label = this.vars.main === "row" ? "m" : "n";
        if (width === undefined) return this[label]() * this.elementWidth();
        const length = this[label]() ? this[label]() : 1;
        this.elementWidth(width / length);
        return this;
    },
    height: function (height) {
        const label = this.vars.main === "row" ? "n" : "m";
        if (height === undefined) return this[label]() * this.elementHeight();
        const length = this[label]() ? this[label]() : 1;
        this.elementHeight(height / length);
        return this;
    },
    insert: function (rowId, colId, value) {
        const element = new Box(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.insertByBaseGrid(rowId, colId, element);
        return this;
    },
    erase: function (rowId, colId) {
        const element = this.element(rowId, colId);
        element.onExit(EX.fade());
        this.eraseByBaseGrid(rowId, colId);
        return this;
    },
};
