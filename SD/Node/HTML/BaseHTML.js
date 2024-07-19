import { ForeignObject } from "../Nake/ForeignObject";
import { render } from "react-dom";

export function BaseHTML(parent) {
    ForeignObject.call(this, parent);

    this.member.new("innerHtml", "");

    return this;
}

BaseHTML.prototype = {
    ...ForeignObject.prototype
};

BaseHTML.prototype.html = undefined;
BaseHTML.prototype.dom = function(jsx) {
    const nake = this._.nake;
    render(jsx, nake);
    return this;
}