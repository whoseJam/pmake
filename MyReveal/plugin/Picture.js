import { ReplaceElement } from "./Util";

export function Picture() {
    return { id: "picture", init: Init };
}

function Init(reveal) {
    const elements = document.getElementsByTagName("picture");
    if (elements.length === 0) return;
    
    const element = elements[0];
    const parent = element.parentNode;

    const url = GetURL(element);
    const width = element.getAttribute("width");
    const height = element.getAttribute("height");

    const div = document.createElement("div");
    const image = document.createElement("img");
    image.setAttribute("data-source", url);
    if (width) image.setAttribute("width", width);
    if (height) image.setAttribute("height", height);
    div.className = element.className;
    div.append(image);

    ReplaceElement(parent, element, div);
    
    div.setAttribute("style", "text-align: center;");

    Init(reveal);
}

function GetURL(element) {
    let src = element.getAttribute("src");
    if (src) return src;
    return element.getAttribute("data-source");
}