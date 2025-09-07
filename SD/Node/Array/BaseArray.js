import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BaseArray extends SDNode {
    constructor(target) {
        super(target);

        this.newLayer("elements");

        this.vars.merge({
            start: 0,
            elements: [],
        });
    }
}

Object.assign(BaseArray.prototype, {
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    },
    start(start) {
        if (arguments.length === 0) return this.vars.start;
        Check.validateNumber(start, `${this.constructor.name}.start`);
        this.vars.lpset("start", start);
        return this;
    },
    end() {
        return this.start() + this.length() - 1;
    },
    length(size) {
        if (arguments.length === 0) {
            const elements = this.vars.elements;
            return elements.length;
        }
        let currentLength = this.length();
        while (currentLength < size) this.push(), currentLength++;
        while (currentLength > size) this.pop(), currentLength--;
        return this;
    },
    resize(size) {
        return this.length(size);
    },
    indexOf(element) {
        for (let i = this.start(); i <= this.end(); i++) if (this.element(i) === element) return i;
        return -1;
    },
    element(i) {
        const id = this.__idx(i);
        if (0 <= id && id < this.length()) return this.vars.elements[id];
        return undefined;
    },
    elements() {
        return [...this.vars.elements];
    },
    firstElement() {
        return this.element(this.start());
    },
    lastElement() {
        return this.element(this.end());
    },
    forEachElement(callback) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachElement`);
        this.vars.elements.forEach((element, id) => callback(element, id + this.start()));
        return this;
    },

    opacity() {
        if (arguments.length === 0) {
            return SD2DNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            if (Check.isOpacity(arguments[0])) {
                const [opacity] = arguments;
                return SD2DNode.prototype.opacity.call(this, opacity);
            } else {
                const [id] = arguments;
                const element = this.__getElementWithMethod(id, "opacity");
                return element.opacity();
            }
        } else {
            const [id, opacity] = arguments;
            const element = this.__getElementWithMethod(id, "opacity");
            element.opacity(opacity);
            return this;
        }
    },
    color() {
        if (arguments.length === 1) {
            if (Check.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachElement(element => element.color(color));
            } else {
                const [id] = arguments;
                const element = this.__getElementWithMethod(id, "color");
                return element.color();
            }
        } else if (arguments.length === 2) {
            const [id, color] = arguments;
            const element = this.__getElementWithMethod(id, "color");
            element.color(color);
            return this;
        } else {
            const [l, r, color] = arguments;
            for (let i = l; i <= r; i++) this.color(i, color);
            return this;
        }
    },
    text(id, text) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (!element.text) ErrorLauncher.methodNotFound(element, "text");
        if (arguments.length === 1) {
            return element.text();
        } else {
            element.text(text);
            return this;
        }
    },
    intValue(id) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    },
    value(i, value) {
        Check.validateNumber(i, `${this.type()}.value`);
        const element = this.__getElementWithMethod(i, "value");
        if (arguments.length === 1) {
            return element.value();
        } else {
            element.value(value);
            return this;
        }
    },

    insert() {
        ErrorLauncher.notImplementedYet("insert", this.type());
    },
    insertFromExistValue() {
        ErrorLauncher.notImplementedYet("insertFromExistValue", this.type());
    },
    insertFromExistElement() {
        ErrorLauncher.notImplementedYet("insertFromExistElement", this.type());
    },
    push(value) {
        this.insert(this.end() + 1, value);
        return this;
    },
    pushFromExistValue(value) {
        this.insertFromExistValue(this.end() + 1, value);
        return this;
    },
    pushFromExistElement(value) {
        this.insertFromExistElement(this.end() + 1, value);
        return this;
    },
    pushArray(array) {
        for (let i = 0; i < array.length; i++) this.push(array[i]);
        return this;
    },

    erase(i) {
        const element = this.element(i);
        if (!element) ErrorLauncher.arrayElementNotFound(i);
        element.onExitDefault(EX.fade());
        this.__erase(i);
        return this;
    },
    pop() {
        this.erase(this.end());
        return this;
    },
    dropElement(id) {
        const element = this.element(id);
        if (!element) return undefined;
        element.onExit(EX.drop());
        this.__erase(id);
        return element;
    },
    dropFirstElement() {
        return this.dropElement(this.start());
    },
    dropLastElement() {
        return this.dropElement(this.end());
    },
    dropValue(id) {
        const element = this.element(id);
        if (!element) return undefined;
        if (!element.drop) ErrorLauncher.methodNotFound(element, "drop");
        return element.drop();
    },
    dropFirstValue() {
        return this.dropValue(this.start());
    },
    dropLastValue() {
        return this.dropValue(this.end());
    },

    sort(l, r, comparator = (a, b) => a.intValue() - b.intValue()) {
        if (arguments.length === 0) return this.sort(this.start(), this.end(), comparator);
        if (arguments.length === 1) return this.sort(this.start(), this.end(), arguments[0]);
        l -= this.start();
        r -= this.start();
        const elements = this.vars.elements;
        const subarray = elements.slice(l, r + 1);
        subarray.sort(comparator);
        elements.splice(l, subarray.length, ...subarray);
        this.vars.elements = elements;
        return this;
    },

    __idx(i) {
        return i - this.start();
    },
    __insert(id, element) {
        this.childAs(element);
        const idx = this.__idx(id);
        if (idx < 0 || idx > this.length()) ErrorLauncher.outOfRangeError(id);
        this.vars.elements.splice(idx, 0, element);
        return this;
    },
    __erase(i) {
        const element = this.element(i);
        const elements = this.vars.elements;
        elements.splice(this.__idx(i), 1);
        this.eraseChild(element);
        return this;
    },
    __getElementWithMethod(id, method) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    },
});
