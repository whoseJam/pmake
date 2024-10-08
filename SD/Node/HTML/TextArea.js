import { BaseHTML } from "./BaseHTML";

export function TextArea(parent) {
    BaseHTML.call(this, parent);

    this.dom(
        <div>
            <textarea>

            </textarea>
        </div>
    );
    this._.textarea = this._.nake.element.children[0].children[0];
    this.width(80).height(100);

    return this;
}

TextArea.prototype = {
    ...BaseHTML.prototype
};

TextArea.prototype.value = function(value) {
    if (value === undefined) {
        return this._.textarea.value;
    }
    this._.textarea.value = value;
    return this;
}