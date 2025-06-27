import { createWaterMark } from "@/Animate/Animate";
import { Device } from "@/Interact/Device";
import { Message } from "@/Interact/Message";
import { Root } from "@/Interact/Root";
import { Status } from "@/Interact/Status";
import React from "react";

global.React = React;

function setupButtonStyles() {
    let styleSheet;
    const css = `button:active { box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }`;
    if (document.styleSheets.length > 0) {
        styleSheet = document.styleSheets[0];
    } else {
        const styleElement = document.createElement("style");
        document.head.appendChild(styleElement);
        styleSheet = styleElement.sheet;
    }
    styleSheet.insertRule(css, 1);
}

setupButtonStyles();

export function init() {
    Root.init();
    Message.init();
    Device.init();
    Status.init();
    createWaterMark();
}
