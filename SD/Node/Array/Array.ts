import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

/**
 * Array component implementing the value-inside-element strategy.
 *
 * Render a uniform array where each element is a **`sd.Box`** instance.
 */
export class Array<E = Box, V = SDNode> extends BaseArray<E, V> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Array");

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
                    element_.x(this.x() + i * this.elementWidth());
                    element_.y(this.y());
                    element_.width(this.elementWidth());
                    element_.height(this.elementHeight());
                });
            });
        });
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.elementWidth() * this.length();
        const length = Math.max(this.length(), 1);
        return this.elementWidth(width / length);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.elementHeight();
        return this.elementHeight(height);
    }
    insert(i: number, value: any) {
        const element = new Box(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        return this.__insert(i, element as E);
    }
    insertFromExistValue(i: number, value: V) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(i, element as E);
        element.valueFromExist(value as SDNode);
        return this;
    }
    insertFromExistElement(i: number, element: E) {
        const element_ = element as SDNode;
        element_.onEnter(EN.moveTo("elements"));
        return this.__insert(i, element_ as E);
    }
    /**
     * Gets the element width of this array component.
     * @returns The uniform width of all array elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this array component.
     * @param width - The uniform width of all array elements.
     * @returns The current component instance for method chainning.
     */
    elementWidth(width: number): this;
    elementWidth(width?: number) {
        if (arguments.length === 0) return this.vars.elementWidth;
        Check.validateNumber(width, `${this.constructor.name}.elementWidth`);
        this.vars.lpset("elementWidth", width);
        return this;
    }
    /**
     * Gets the element height of this array component.
     * @returns The uniform height of all array elements.
     */
    elementHeight(): number;
    /**
     * Sets the element height of this array component.
     * @param height - The uniform height of all array component.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
    elementHeight(height?: number) {
        if (arguments.length === 0) return this.vars.elementHeight;
        Check.validateNumber(height, `${this.constructor.name}.elementHeight`);
        this.vars.lpset("elementHeight", height);
        return this;
    }
}
