import { BaseHTML } from "./BaseHTML";

export function Button(parent) {
    BaseHTML.call(this, parent);
    
    this.html(`<button style="width: 60px; height: 20px;">点击</button>`);
    
    const nake = this._.nake;
    const div = nake.children[0];
    this._.button = div.children[0];

    return this;
}

Button.prototype = {
    ...BaseHTML.prototype
};

Button.prototype.onClick = function(callback) {
    this._.button.onclick = callback;
    return this;
}