import { ForeignObject } from "@/Node/Nake/ForeignObject";

import React from "react";
import { render } from "react-dom";

global.React = React;

export function BaseHTML(parent) {
    ForeignObject.call(this, parent);

    this._.BASE_HTML = true;
}

BaseHTML.prototype = {
    ...ForeignObject.prototype
};

BaseHTML.prototype.html = undefined;
BaseHTML.prototype.dom = function(jsx) {
    const nake = this._.nake;
    render(jsx, nake.element);
    return this;
}