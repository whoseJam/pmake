import { SDNode } from "@/Node/SDNode";

export class Text extends SDNode {
    constructor(target, text = "") {
        const { TextSVG } = require("@/Node/Text/TextSVG");
        return new TextSVG(target, text);
    }
}
