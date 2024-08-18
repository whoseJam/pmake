import { ReplaceElement } from "./Util";

export function Problem() {
    return { id: "problem", init: Init };
}

function Init(reveal) {
    const elements = document.getElementsByTagName("problem");
    if (elements.length === 0) return;

    const element = elements[0];
    const parent = element.parentNode;
    let src = element.getAttribute("src");
    if (!src) src = element.getAttribute("data-src");
    if (!src) src = element.getAttribute("data-source");

    const section = document.createElement("section");
    section.setAttribute("data-background-iframe", src);
    section.setAttribute("data-background-interactive", "");
    ReplaceElement(parent, element, section);

    Init(reveal);
}