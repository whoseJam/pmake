import { SD2DNode } from "@/Node/SD2DNode";
import React from "react";

global.React = React;

export class BaseHTML extends SD2DNode {
    constructor(target) {
        super(target);

        this._.layer.setAttribute("position", "absolute");
        this._.layer.setAttribute("pointer-events", "auto");
        this._.layer.setAttribute("left", 0);
        this._.layer.setAttribute("top", 0);
    }
}
