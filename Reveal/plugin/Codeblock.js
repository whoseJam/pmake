import { ReplaceElement } from "./Util";

export function Codeblock() {
    return { id: "codeblock", init: Init };
}

function Init(reveal) {
    const elements = document.getElementsByTagName("codeblock");
    if (elements.length === 0) return;

    const element = elements[0];
    const parent = element.parentNode;
    const script = element.querySelector("script");
    let lang = element.getAttribute("lang");
    if (!lang) lang = "cpp";

    // const div = document.createElement("div");
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.className = element.className;
    code.setAttribute("data-trim", "");
    code.setAttribute("data-line-numbers", "");
    code.setAttribute("class", lang);
    // div.append(pre);
    pre.append(code);
    code.append(script);

    ReplaceElement(parent, element, pre);

    Init(reveal);
}
