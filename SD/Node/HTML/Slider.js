import { BaseHTML } from "./BaseHTML";
import { naiveGetterAndSetter, normalUpdate } from "../Common";
import { Interp } from "@/Animate/Interp";

export function Slider(parent) {
    BaseHTML.call(this, parent);

    this.member.new("onChanged", undefined);
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
                            callback(sourceElement.value);
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

Slider.prototype.max = naiveGetterAndSetter("max", "set");
Slider.prototype.min = naiveGetterAndSetter("min", "set");
Slider.prototype.value = function() {
    return this._.slider.value;
}

Slider.prototype.updateList = [
    ...Slider.prototype.updateList,
    normalUpdate("max", Interp.numberInterp, "slider"),
    normalUpdate("min", Interp.numberInterp, "slider")
]