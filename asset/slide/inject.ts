
interface VoidFunction {
    (): void
}

export function includeHTML(callback: VoidFunction|null|undefined): void {
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let file = element.getAttribute("w3-include-html");
        if (!file) {
            file = element.getAttribute("include-html");
        }
        if (!file) {
            continue;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const parser = new DOMParser();
                const htmlString = this.responseText;
                const doc = parser.parseFromString(htmlString, "text/html");
                const body = doc.documentElement.children[1];
                const parent = element.parentNode;
                if (!parent) {
                    return;
                }
                while (body.children.length > 0) {
                    const child = body.children[body.children.length - 1];
                    parent.insertBefore(child, element.nextSibling);
                }
                parent.removeChild(element);
                includeHTML(callback);
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
    }
    if (callback) {
        callback();
    }
}