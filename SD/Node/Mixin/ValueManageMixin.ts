import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode, SDNodeWithText } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

/**
 * Mixin that provides value management functionality.
 * This mixin adds methods for managing a "value" child component.
 */
export function ValueManageMixin<T extends new (...args: any[]) => SDNode>(Base: T) {
    return class extends Base {
        /**
         * @returns The default rule for positioning value components.
         */
        __defaultValueRule(): SDRule {
            ErrorLauncher.notImplementedYet(`${this.constructor.name}.__defaultValueRule`);
            return undefined;
        }
        /**
         * Casts the value component to its string representation.
         * - If the value component does not exist, returns an empty string ("").
         * - If the value component cannot be casted to a string, throws an Error.
         * @returns The string representation of the value component.
         */
        text(): string;
        /**
         * Sets the text content of the value component.
         * - If the value component does not exist, creates a new **`sd.Text`** instance to hold the text.
         * - If the value component value does not support text formatting, throws an Error.
         * @param text - The text content to apply.
         * @returns The current component instance for method chaining.
         */
        text(text: string | number): this;
        text(text?: string | number) {
            const value = this.child("value") as SDNodeWithText;
            if (arguments.length === 0) {
                if (!value) return "";
                if (!value.text) ErrorLauncher.methodNotFound(value, "text");
                return value.text();
            } else {
                if (!value) return this.value(text);
                if (!value.text) ErrorLauncher.methodNotFound(value, "text");
                value.text(text);
                return this;
            }
        }

        /**
         * Casts the value component to its integer representation.
         * - If the value component does not exists, returns zero.
         * - If the value component cannot be casted to an integer, throws an Error.
         * @returns The integer representation of the value component.
         */
        intValue(): number {
            const value = this.child("value") as SDNodeWithText;
            if (!value) return 0;
            if (!value.text) ErrorLauncher.methodNotFound(value, "text");
            const i = Math.floor(+value.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(value.text());
            return i;
        }

        /**
         * Gets the value component of this component.
         * @returns The value component instance, or undefined if no value component has been set.
         */
        value(): SDNode;
        /**
         * Sets the value component of this component.
         * - Replaces any existing value component with the provided value.
         * - Removes the current value without replacement if provided value is null or undefined.
         * - Converts to **`sd.Text`** instance if provided value is number or string.
         * @param value - The provided value.
         * @param rule - Optional responsive rule.
         * @returns The current component instance for method chaining.
         */
        value(value: any, rule?: SDRule): this;
        value(value?: any, rule?: SDRule) {
            if (arguments.length === 0) return this.child("value");
            if (this.hasChild("value")) this.eraseChild("value");
            if (Check.isEmpty(value)) return this;
            value = SDNode.__asNode(this, value);
            const rule_ = rule || this.__defaultValueRule();
            return this.childAs("value", value, rule_);
        }

        /**
         * Sets the value component of this component with an animated transition from its current position.
         *
         * Unlike standard value assignment, this method animates the movement of value component
         * from its original position to the new target position within the component.
         * @param value - The provided value component.
         * @param rule - Optional responsive rule.
         * @returns The current component instance for method chaining.
         */
        valueFromExist(value: SDNode, rule?: SDRule): this {
            if (this.hasChild("value")) this.eraseChild("value");
            value.onEnter(EN.moveTo());
            const rule_ = rule || this.__defaultValueRule();
            this.childAs("value", value, rule_);
            return this;
        }

        /**
         * Detaches the value component from this component while preserving it in the scene.
         * - Removes association between the value component and this component.
         * - Leaves the value component present in the scene.
         * - Returns the detached component for potential reuse.
         * @returns The detached value component instance, or undefined if no value component was present.
         */
        drop(): SDNode {
            const value = this.child("value");
            if (!value) return undefined;
            value.onExit(EX.drop());
            this.eraseChild(value);
            return value;
        }
    };
}
