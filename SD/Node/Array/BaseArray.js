import { SDNode } from "@/Node/SDNode";
import { Exit as EX } from "@/Node/SDNode/Exit";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseArray(parent) {
    SDNode.call(this, parent);

    this.newLayer("elements");

    this.vars.merge({
        start: 0,
        elements: [],
    });

    this._.BASE_ARRAY = true;
}

BaseArray.prototype = {
    ...SDNode.prototype,
};

BaseArray.prototype.x = Factory.handlerLowPrecise("x");
BaseArray.prototype.y = Factory.handlerLowPrecise("y");
BaseArray.prototype.start = Factory.handler("start");

BaseArray.prototype.length = function (size) {
    if (size === undefined) {
        const elements = this.vars.elements;
        return elements.length;
    }
    size = Cast.castToNumber(size);
    let currentLength = this.length();
    while (currentLength < size) {
        this.push();
        currentLength++;
    }
    while (currentLength > size) {
        this.pop();
        currentLength--;
    }
    return this;
};

BaseArray.prototype.resize = function (size) {
    this.length(size);
    return this;
};

BaseArray.prototype.end = function () {
    return this.start() + this.length() - 1;
};

BaseArray.prototype.idx = function (i) {
    return i - this.start();
};

BaseArray.prototype.element = function (i) {
    const elements = this.vars.elements;
    const id = this.idx(i);
    if (0 <= id && id < elements.length) return elements[id];
    ErrorLauncher.outOfRangeError(i);
};

BaseArray.prototype.elements = function () {
    const elements = this.vars.elements;
    return [...elements];
};

BaseArray.prototype.firstElement = function () {
    return this.element(this.start());
};

BaseArray.prototype.lastElement = function () {
    return this.element(this.end());
};

BaseArray.prototype.forEachElement = function (callback) {
    const elements = this.vars.elements;
    elements.forEach((element, i) => {
        callback(element, i);
    });
    return this;
};

BaseArray.prototype.insertByBaseArray = function (i, element) {
    const elements = this.vars.elements;
    element.triggerEnter(this, () => {
        this.childAs(element);
        elements.splice(this.idx(i), 0, element);
    });
    return this;
};

BaseArray.prototype.push = function (value = null) {
    this.insert(this.end() + 1, value);
    return this;
};

BaseArray.prototype.pushArray = function (array) {
    for (let i = 0; i < array.length; i++) this.push(array[i]);
    return this;
};

BaseArray.prototype.pushFromExistValue = function (value) {
    this.insertFromExistValue(this.end() + 1, value);
    return this;
};

BaseArray.prototype.pushFromExistElement = function (value) {
    this.insertFromExistElement(this.end() + 1, value);
    return this;
};

BaseArray.prototype.eraseByBaseArray = function (i) {
    const element = this.element(i);
    const elements = this.vars.elements;
    elements.splice(this.idx(i), 1);
    this.eraseChild(element);
    return this;
};

BaseArray.prototype.pop = function () {
    this.erase(this.end());
    return this;
};

BaseArray.prototype.erase = function (i) {
    const element = this.element(i);
    element.onExit(EX.fade());
    this.eraseByBaseArray(i);
    return this;
};

BaseArray.prototype.dropElement = function (i) {
    const element = this.element(i);
    this.eraseByBaseArray(i);
    return element;
};

BaseArray.prototype.dropFirstElement = function () {
    return this.dropElement(this.start());
};

BaseArray.prototype.dropLastElement = function () {
    return this.dropElement(this.end());
};

BaseArray.prototype.dropValue = function (i) {
    const element = this.element(i);
    this.eraseByBaseArray(i);
    const value = element.after(this.delay()).drop();
    element.startAnimate(this).opacity(0).remove();
    return value;
};

BaseArray.prototype.text = function (i, text) {
    if (text === undefined) return this.value(i).text();
    this.value(i).text(text);
    return this;
};

BaseArray.prototype.intValue = function (i) {
    const value = this.value(i);
    if (value === undefined) return 0;
    return +this.value(i).text();
};

BaseArray.prototype.opacity = function () {
    const args = arguments;
    switch (args.length) {
        case 0:
            return SDNode.prototype.opacity.call(this);
        case 1:
            return Check.isTypeOfOpacity(args[0]) ? SDNode.prototype.opacity.call(this, args[0]) : this.element(args[0]).opacity();
        case 2:
            this.element(args[0]).opacity(args[1]);
            return this;
        default:
            ErrorLauncher.invalidArguments();
    }
};

BaseArray.prototype.value = function () {
    const args = arguments;
    switch (args.length) {
        case 1:
            return this.element(args[0]).value();
        case 2:
            this.element(args[0]).value(args[1]);
            return this;
        default:
            ErrorLauncher.invalidArguments();
    }
};

BaseArray.prototype.color = function () {
    const args = arguments;
    switch (args.length) {
        case 1:
            if (typeof args[0] === "number") return this.element(args[0]).color();
            this.forEachElement(element => element.color(args[0]));
            return this;
        case 2:
            this.element(args[0]).color(args[1]);
            return this;
        case 3:
            for (let i = args[0]; i <= args[1]; i++) this.color(i, args[2]);
            return this;
        default:
            ErrorLauncher.invalidArguments();
    }
};

BaseArray.prototype.sort = function (comparator = (a, b) => a.intValue() - b.intValue()) {
    const elements = this.vars.elements;
    elements.sort(comparator);
    return this;
};
