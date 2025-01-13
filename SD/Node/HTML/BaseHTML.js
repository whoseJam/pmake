import React from "react";
import { render } from "react-dom";

global.React = React;

export function BaseHTML(parent) {
    this._.BASE_HTML = true;
}

BaseHTML.prototype.dom = function (jsx) {
    const nake = this._.nake;
    render(jsx, nake.element);
    return this;
};
