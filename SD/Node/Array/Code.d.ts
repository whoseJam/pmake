import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Text/Text";
import { RenderNode } from "@/Renderer/RenderNode";

export class Code extends BaseArray<Text, Text> {
    constructor(target: SDNode | RenderNode, code?: string);
    l(): number;
    r(): number;
    fontSize(): number;
    fontSize(fontSize: number): this;
    code(source: string): this;
    focus(row: number | false | null | undefined): this;
    focus(l: number, r: number): this;
}
