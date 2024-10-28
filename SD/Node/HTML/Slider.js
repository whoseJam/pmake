import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

function SliderCallback(event) {
    const callback = this.member.get("onChange");
    if (callback) {
        const nativeEvent = event.nativeEvent;
        const sourceElement = nativeEvent.srcElement;
        callback(+sourceElement.value);
    }
}
export function Slider(parent) {
    BaseHTML.call(this, parent);

    this.member.new("onChange", undefined);
    this.member.new("min", 0);
    this.member.new("max", 10);

    this.dom(
        <input
            style={{ width: "90%", height: "100%" }}
            type={ "range" }
            min={ 0 }
            max={ 10 }
            onChange={ SliderCallback.bind(this) }
        />
    )
    this._.slider = new HTMLNode(this, undefined, this._.nake.nake().children[0]);
    
    this.width(60).height(25);
}

Slider.prototype = {
    ...BaseHTML.prototype
};

Slider.prototype.onChange = function(callback) {
    this.member.setAndFlush("onChange", callback);
    return this;
}

Slider.prototype.max = function(max) {
    if (max === undefined) return this._.slider.getAttribute("max");
    this._.slider.setAttribute("max", max);
    return this;
}

Slider.prototype.min = function(min) {
    if (min === undefined) return this._.slider.getAttribute("min");
    this._.slider.setAttribute("min", min);
    return this;
}

Slider.prototype.value = function(value) {
    if (value === undefined) return this._.slider.getAttribute("value");
    this._.slider.setAttribute("value", value);
    return this;
}