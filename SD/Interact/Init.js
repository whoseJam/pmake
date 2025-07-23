import { createWaterMark } from "@/Animate/Animate";
import { Device } from "@/Interact/Device";
import { Message } from "@/Interact/Message";
import { Root } from "@/Interact/Root";
import { Status } from "@/Interact/Status";
import { PathEngine } from "@/Node/Path/PathEngine";
import { TextEngine } from "@/Node/Text/TextEngine";

function setupButtonStyles() {
    const css = `button:active { box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }`;
    const styleSheet = new CSSStyleSheet();
    styleSheet.insertRule(css, 0);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
}

setupButtonStyles();

export function init() {
    Root.init();
    Message.init();
    Device.init();
    Status.init();
    TextEngine.init();
    PathEngine.init();
    createWaterMark();
}
