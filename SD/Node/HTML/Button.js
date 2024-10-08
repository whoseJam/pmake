import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";


export function Button(parent) {
    BaseHTML.call(this, parent);

    this.member.new("text", "点击");
    this.member.new("onClick", undefined);
    
    this.dom(
        <div>
            <button
                style={{
                    width: "90%",
                    height: "90%",
                    top: "50%",
                    left: "50%",
                }}
                onClick={() => {
                    const callback = this.member.get("onClick");
                    if (callback) {
                        callback.call(this);
                    }
                }}
                >
                点击
            </button>
        </div>
    );

    this._.button = this._.nake.element.children[0].children[0];

    this.width(60).height(25);

    return this;
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
    function() {
        if (this.member.hasChanged("text")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("text"),
                this.member.get("text"),
                Interp.innerHTMLInterp(this._.button),
                this, "text"
            );
            this.member.flush("text");
        }
    }
]