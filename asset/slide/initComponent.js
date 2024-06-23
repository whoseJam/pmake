function replace(parent, oldElement, newElement) {
    parent.insertBefore(newElement, oldElement.previousSibling);
    parent.removeChild(oldElement);
}

function initCodeblock() {
    const elements = document.getElementsByTagName("codeblock");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const parent = element.parentNode;
        const script = element.getElementsByTagName("script")[0];
        let lang = element.getAttribute("lang");
        if (!lang) lang = "cpp";
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.setAttribute("data-trim", "");
        code.setAttribute("data-line-numbers", "");
        code.setAttribute("class", lang);
        pre.append(code);
        code.append(script);
        replace(parent, element, pre);
    }
}

function initPicture() {
    const elements = document.getElementsByTagName("picture");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        console.log("element = ", element);
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
        div.style["textAlign"] = "center";
        div.append(image);
        replace(parent, element, div);
    }
}

export function initComponent() {
    initPicture();
    initCodeblock();
}