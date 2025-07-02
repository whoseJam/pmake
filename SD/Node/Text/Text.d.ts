import { BaseText } from "@/Node/Text/BaseText";

export class Text extends BaseText {
    /**
     * Gets the font family of this text component.
     * @returns The font family.
     */
    fontFamily(): string;
    /**
     * Sets the font family of this text component.
     *
     * Only "Consolas", "Arial" and "Times New Roman" are supported. Default to "Consolas".
     * @param family - The font family to apply.
     * @returns The current component instance for method chaining.
     */
    fontFamily(family: string): this;
}
