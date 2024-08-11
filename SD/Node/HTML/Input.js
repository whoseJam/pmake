import { Interp } from "@/Animate/Interp";
import { GetterAndSetter, normalUpdate } from "../Common";
import { BaseHTML } from "./BaseHTML";

export function Input(parent) {
    BaseHTML.call(this, parent);

    this.member.new("label", "输入框");

    this.dom(
        <div style={{
            display: "flex",
            maxWidth: "100%",
            maxHeight: "100%",
            justifyContent: "space-between"
        }}>
            <label style={{
                flexGrow: "0",
                marginRight: "3px"
            }}>输入框</label>
            <input
                style={{
                    width: "50%",
                    flexGrow: "1"
                }}
                type={ "text" }
            />
        </div>
    );

    const div = this._.nake.children[0];
    this._.label = div.children[0];
    this._.input = div.children[1];
    this.width(120).height(25);

    return this;
}

Input.prototype = {
    ...BaseHTML.prototype
}

Input.prototype.label = GetterAndSetter("label", "set");

Input.prototype.value = function() {
    return this._.input.value;
}

Input.prototype.updateList = [
    ...Input.prototype.updateList,
    normalUpdate("label", Interp.innerHTMLInterp, "label")
];