import { Interp } from "@/Animate/Interp";

import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";

export function Slider(parent) {
    BaseHTML.call(this, parent);

    this.member.new("onChange", undefined);
    this.member.new("min", 0);
    this.member.new("max", 10);

    this.dom(
        <div>
            <input
                style={
                    {   width: "90%",
                        height: "100%"
                    }
                }
                type={ "range" }
                min={ 0 }
                max={ 10 }
                onChange={
                    (event) => {
                        const callback = this.member.get("onChange");
                        if (callback) {
                            const nativeEvent = event.nativeEvent;
                            const sourceElement = nativeEvent.srcElement;
                            callback(+sourceElement.value);
                        }
                    }
                } />
        </div>
    )
    this._.slider = this._.nake.children[0].children[0];
    this.width(60).height(25);

    return this;
}

Slider.prototype = {
    ...BaseHTML.prototype
};

Slider.prototype.onChange = function(callback) {
    this.member.setAndFlush("onChange", callback);
    return this;
}

Slider.prototype.max = SDNode.OrdinaryGSet("max", "set");
Slider.prototype.min = SDNode.OrdinaryGSet("min", "set");
Slider.prototype.value = function(value) {
    if (value === undefined) {
        return +this._.slider.value;
    }
    this._.slider.value = value;
    return this;
}

Slider.prototype.updateList = [
    ...Slider.prototype.updateList,
    SDNode.OrdinaryUpdate("max", Interp.numberInterp, "slider"),
    SDNode.OrdinaryUpdate("min", Interp.numberInterp, "slider")
]