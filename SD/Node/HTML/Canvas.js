import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

import { BaseHTML } from "@/Node/HTML/BaseHTML";

export function Canvas(parent) {
    BaseHTML.call(this, parent);

    this.dom(
        <canvas style={{ width: "100%", height: "100%" }}>
        </canvas>
    );
    this._.canvas = new HTMLNode(this, undefined, this._.nake.nake().children[0]);

    this.width(400).height(300);
}

Canvas.prototype = {
    ...BaseHTML.prototype
};
