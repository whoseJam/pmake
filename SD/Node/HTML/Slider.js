import { useState } from "react";
import { BaseHTML } from "./BaseHTML";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";
import { Action } from "@/Animate/Action";

export function Slider(parent) {
    BaseHTML.call(this, parent);

    // const [l, setL] = useState(0);
    // [r, setR] = useState(10);

    this.member.new("onChanged", undefined);

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
                        const callback = this.member.get("onChanged");
                        if (callback) {
                            const nativeEvent = event.nativeEvent;
                            const sourceElement = nativeEvent.srcElement;
                            callback(sourceElement.value);
                        }
                    }
                } />
        </div>
    )

    this.width(60).height(25);

    return this;
}

Slider.prototype = {
    ...BaseHTML.prototype
};

Slider.prototype.onChanged = function(callback) {
    this.member.setAndFlush("onChanged", callback);
    return this;
}

Slider.prototype.max = naiveGetterAndSetter("max", "set");

Slider.prototype.updateList = [
    ...Slider.prototype.updateList
]

function update() {
    if (this.member.hasChanged("max")) {
        const elementId = this.id;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("max"),
            this.member.get("max"),
            function(t) {
                const from = this.from;
                const to = this.to;
                const e = document.getElementById(elementId);
            },
            this, "max"
        );
    }
}