
export class Dom {
    static createElement(tag, id) {
        const element = document.createElement(tag);
        if (id !== undefined) element.id = id;
        return element;
    }

    static createElementAndAppendToBody(tag, id) {
        const element = Dom.createElement(tag, id);
        document.body.append(element);
        return element;
    }

    static createSVGElement(tag, id) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        if (id !== undefined) element.id = id;
        return element;
    }

    static getByID(id) {
        return document.getElementById(id);
    }

    static tagName(element) {
        return element.tagName;
    }

    static parent(element) {
        return element.parentElement;
    }
}