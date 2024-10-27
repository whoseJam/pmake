import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

import { BaseHTML } from "@/Node/HTML/BaseHTML";

export function TextArea(parent) {
    BaseHTML.call(this, parent);

    this.dom(
        <textarea style={{ width: "100%", height: "100%" }}>

        </textarea>
    );
    this._.textarea = new HTMLNode(this, undefined, this._.nake.element.children[0]);
    
    this.width(80).height(100);
}

TextArea.prototype = {
    ...BaseHTML.prototype
};

TextArea.prototype.value = function(value) {
    if (value === undefined) {
        return this._.textarea.nake().value;
    }
    this._.textarea.nake().value = value;
    return this;
}