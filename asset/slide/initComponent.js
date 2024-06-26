function replace(parent, oldElement, newElement) {
    copyStyles(oldElement, newElement);
    parent.insertBefore(newElement, oldElement.previousSibling);
    parent.removeChild(oldElement);
}

function copyStyles(source, target) {
    const style = source.getAttribute("style");
    target.setAttribute("style", style);
}

function initCodeblock() {
    const elements = document.getElementsByTagName("codeblock");
    if (elements.length === 0) return;
    const element = elements[0];
    const parent = element.parentNode;
    const script = element.getElementsByTagName("script")[0];
    let lang = element.getAttribute("lang");
    if (!lang) lang = "cpp";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.className = element.className;
    code.setAttribute("data-trim", "");
    code.setAttribute("data-line-numbers", "");
    code.setAttribute("class", lang);
    pre.append(code);
    code.append(script);
    replace(parent, element, pre);
    initCodeblock();
}

function initPicture() {
    const elements = document.getElementsByTagName("picture");
    if (elements.length === 0) return;
    const element = elements[0];
    const parent = element.parentNode;
    let src = element.getAttribute("src");
    if (!src) src = element.getAttribute("data-src");
    const width = element.getAttribute("width");
    const height = element.getAttribute("height");

    const div = document.createElement("div");
    const image = document.createElement("img");
    image.setAttribute("data-src", src);
    if (width) image.setAttribute("width", width);
    if (height) image.setAttribute("height", height);
    div.className = element.className;
    div.append(image);
    replace(parent, element, div);
    div.setAttribute("style", "text-align: center;");
    initPicture();
}

function initProblem() {
    const elements = document.getElementsByTagName("problem");
    if (elements.length === 0) return;
    const element = elements[0];
    const parent = element.parentNode;
    let src = element.getAttribute("src");
    if (!src) src = element.getAttribute("data-src");

    const section = document.createElement("section");
    section.setAttribute("data-background-iframe", src);
    section.setAttribute("data-background-interactive", "");
    replace(parent, element, section);
    initProblem();
}

export function initComponent() {
    initPicture();
    initCodeblock();
    initProblem();
}