import { Action } from "@/Animate/Action";
import { GetterAndSetter } from "../Common";
import { BaseHTML } from "./BaseHTML";
import { Interp } from "@/Animate/Interp";

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

    this._.button = this._.nake.children[0].children[0];

    this.width(60).height(25);

    return this;
}

Button.prototype = {
    ...BaseHTML.prototype
};

Button.prototype.text = GetterAndSetter("text", "set");

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