import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Input(parent) {
    BaseHTML.call(this, parent);

    this.member.new("label", "输入框");

    this.dom(
        <div style={{ display: "flex", maxWidth: "100%", maxHeight: "100%", justifyContent: "space-between" }}>
            <label style={{ flexGrow: "0", marginRight: "3px"}}>
                输入框
            </label>
            <input style={{ flexGrow: "1", width: "50%" }} type={"text"} />
        </div>
    );

    const div = this._.nake.nake().children[0];
    this._.label = new HTMLNode(this, undefined, div.children[0]);
    this._.input = new HTMLNode(this, undefined, div.children[1]);

    this.width(120).height(25);
}

Input.prototype = {
    ...BaseHTML.prototype
}

Input.prototype.label = SDNode.OrdinaryGSet("label", "set");

Input.prototype.value = function() {
    return this._.input.nake().value;
}

Input.prototype.updateList = [
    ...Input.prototype.updateList,
    SDNode.OrdinaryUpdate("label", Interp.innerHTMLInterp, "label", "innerHTML")
];