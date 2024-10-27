import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

function ButtonCallback() {
    const callback = this.member.get("onClick");
    if (callback) callback.call(this);
}

export function Button(parent) {
    BaseHTML.call(this, parent);

    this.member.new("text", "点击");
    this.member.new("onClick", undefined);
    
    this.dom(
        <button
            style={{ width: "90%", height: "90%", top: "50%", left: "50%" }}
            onClick={ ButtonCallback.bind(this) }>
            点击
        </button>
    );

    this._.button = new HTMLNode(this, undefined, this._.nake.nake().children[0]);

    this.width(60).height(25);
}

Button.prototype = {
    ...BaseHTML.prototype
};

Button.prototype.text = SDNode.OrdinaryGSet("text", "set");

Button.prototype.onClick = function(callback) {
    this.member.setAndFlush("onClick", callback);
    return this;
}

Button.prototype.updateList = [
    ...Button.prototype.updateList,
    SDNode.OrdinaryUpdate("text", Interp.innerHTMLInterp, "button", "innerHTML")
]