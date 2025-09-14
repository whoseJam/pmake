import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Stack } from "@/Node/Array/Stack";
import { Box } from "@/Node/Element/Box";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Pile<E = Box, V = SDNode> extends BaseArray<E, V> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Pile");

        this.vars.merge({
            x: 0,
            my: 0,
            elementWidth: 40,
            elementHeight: 40,
        });

        this.effect("array", () => {
            this.forEachElement((element, i) => {
                i = this.__idx(i);
                this.tryUpdate(element, () => {
                    const element_ = element as Box;
                    element_.width(this.elementWidth());
                    element_.height(this.elementHeight());
                    element_.x(this.x());
                    element_.y(this.my() - (i + 1) * this.elementHeight());
                });
            });
        });
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.my() - this.height();
        return this.my(y + this.height());
    }
    my(): number;
    my(my: number): this;
    my(my?: number) {
        if (arguments.length === 0) return this.vars.my;
        Check.validateNumber(my, `${this.constructor.name}.my`);
        this.vars.my = my;
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.elementWidth();
        return this.elementWidth(width);
    }
    height(): number;
    height(height: number): this;
    height() {
        return Stack.prototype.height.apply(this, arguments);
    }
    insert(i: number, value: any): this {
        return Array.prototype.insert.apply(this, arguments);
    }
    insertFromExistElement(i: number, element: E): this {
        return Array.prototype.insertFromExistElement.apply(this, arguments);
    }
    insertFromExistValue(i: number, value: V): this {
        return Array.prototype.insertFromExistValue.apply(this, arguments);
    }
    elementWidth(): number;
    elementWidth(width: number): this;
    elementWidth() {
        return Array.prototype.elementWidth.apply(this, arguments);
    }
    elementHeight(): number;
    elementHeight(height: number): this;
    elementHeight() {
        return Array.prototype.elementHeight.apply(this, arguments);
    }
}
