import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Stack<E = Box, V = SDNode> extends BaseArray<E, V> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Stack");

        this.vars.merge({
            x: 0,
            y: 0,
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
                    element_.y(this.y() + i * this.elementHeight());
                });
            });
        });
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.elementWidth();
        return this.elementWidth(width);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.elementHeight() * this.length();
        const length = Math.max(this.length(), 1);
        return this.elementHeight(height / length);
    }
    insert(i: number, value: any): this {
        return Array.prototype.insert.apply(this, arguments);
    }
    insertFromExistValue(i: number, value: V): this {
        return Array.prototype.insertFromExistValue.apply(this, arguments);
    }
    insertFromExistElement(i: number, element: E): this {
        return Array.prototype.insertFromExistElement.apply(this, arguments);
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
