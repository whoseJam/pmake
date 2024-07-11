import { ForeignObject } from "../Nake/ForeignObject";

export function BaseHTML(parent) {
    ForeignObject.call(this, parent);

    this.member.new("innerHtml", "");

    return this;
}

BaseHTML.prototype = {
    ...ForeignObject.prototype
};

BaseHTML.prototype.html = function(html) {
    if (html === undefined) {
        return this.member.get("innerHtml");
    }
    this.member.setAndFlush("innerHtml", html);
    const div = document.createElement("div");
    div.innerHTML = html;
    this._.nake.append(div);
    return this;
}