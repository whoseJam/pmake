import { SDSVGNode } from "@/Node/SDSVGNode";

type TextMappingSubtextItem = [string, string];
type TextMappingObjectSubtextItem = [BaseText, string, string];
type TextMappingObjectItem = [BaseText, string];
type TextMappingItem = TextMappingSubtextItem | TextMappingObjectSubtextItem | TextMappingObjectItem;
export type TextMappingLocation =
    | { i: number; subtext: string }
    | { object: BaseText; subtext: string }
    | string
    | BaseText;
export type TextMappingObject = {
    source: TextMappingLocation;
    target: TextMappingLocation;
};
type TextMappingDictionary = { [key: string]: string };
export type TextMapping = TextMappingDictionary | Array<TextMappingItem>;
export type TextMappingArray = Array<TextMappingObject>;

export function processMapping(mapping: TextMapping): TextMappingArray {
    const result = [] as TextMappingArray;
    function processArraySubtextItem(item: TextMappingSubtextItem): TextMappingObject {
        return { source: String(item[0]), target: String(item[1]) };
    }
    function processArrayObjectSubtextItem(item: TextMappingObjectSubtextItem): TextMappingObject {
        return { source: { object: item[0], subtext: String(item[1]) }, target: String(item[2]) };
    }
    function processArrayObjectItem(item: TextMappingObjectItem): TextMappingObject {
        return { source: item[0], target: String(item[1]) };
    }
    function processArrayItem(item: Array<any>): TextMappingObject {
        if (item.length === 3) return processArrayObjectSubtextItem(item as TextMappingObjectSubtextItem);
        if (typeof item[0] === "number" || typeof item[0] === "string")
            return processArraySubtextItem(item as TextMappingSubtextItem);
        return processArrayObjectItem(item as TextMappingObjectItem);
    }
    if (Array.isArray(mapping))
        return mapping.map(item => {
            if (Array.isArray(item)) return processArrayItem(item);
            return item;
        });
    for (const key in mapping) {
        const value = mapping[key];
        result.push({
            source: String(key),
            target: String(value),
        });
    }
    return result;
}

export type TextConfigDictionary = { [key: string]: any };

export abstract class BaseText extends SDSVGNode {
    constructor() {
        super();

        this.vars.merge({
            x: 0,
            y: 0,
        });
    }

    getX(): number {
        return this.vars.x;
    }

    setX(x: number): this {
        this.vars.lpset("x", x);
        return this;
    }

    setCenterX(cx: number): this {
        this.setX(cx - this.getWidth() / 2);
        return this;
    }

    setCx(cx: number): this {
        this.setCenterX(cx);
        return this;
    }

    getY(): number {
        return this.vars.y;
    }

    setY(y: number): this {
        this.vars.lpset("y", y);
        return this;
    }

    setCenterY(cy: number): this {
        this.setY(cy - this.getHeight() / 2);
        return this;
    }

    setCy(cy: number): this {
        this.setCenterY(cy);
        return this;
    }
}
