import { SDNode } from "@/Node/SDNode";

import { Cast }          from "@/Utility/Cast";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function BaseArray(parent) {
    SDNode.call(this, parent);

    this.member.new("start", 0);
    this.member.new("elements", []);
    
    this._.BASE_ARRAY = true;
}

BaseArray.prototype = {
    ...SDNode.prototype
};

BaseArray.prototype.x     = SDNode.OrdinaryGSet("x", "setByEqual");
BaseArray.prototype.y     = SDNode.OrdinaryGSet("y", "setByEqual");
BaseArray.prototype.start = SDNode.OrdinaryGSet("start", "set");
BaseArray.prototype.updateList = [...BaseArray.prototype.updateList];

BaseArray.prototype.length = function(size) {
    if (size === undefined) {
        const elements = this.member.get("elements");
        return elements.length;
    }
    size = Cast.castToNumber(size);
    let currentLength = this.length();
    while (currentLength < size) { this.push(); currentLength++; }
    while (currentLength > size) { this.pop();  currentLength--; }
    return this;
}

BaseArray.prototype.resize = function(size) {
    this.length(size);
    return this;
}

BaseArray.prototype.end = function() {
    return this.start() + this.length() - 1;
}

BaseArray.prototype.idx = function(idx) {
    return idx - this.start();
}

BaseArray.prototype.element = function(idx) {
    const elements = this.member.get("elements");
    const index = this.idx(idx);
    if (0 <= index && index < elements.length)
        return elements[index];
    ErrorLauncher.outOfRangeError(idx);
}

BaseArray.prototype.firstElement = function() {
    return this.element(this.start());
}

BaseArray.prototype.lastElement = function() {
    return this.element(this.end());
}

BaseArray.prototype.push = function(value = null) {
    this.insert(this.end() + 1, value);
    return this;
}

BaseArray.prototype.pushArray = function(array) {
    for (let i = 0; i < array.length; i++)
        this.push(array[i]);
    return this;
}

BaseArray.prototype.pushFromExistValue = function(value) {
    this.insertFromExistValue(this.end() + 1, value);
    return this;
}

BaseArray.prototype.pushFromExistElement = function(value) {
    this.insertFromExistElement(this.end() + 1, value);
    return this;
}

BaseArray.prototype.pop = function() {
    this.erase(this.end());
    return this;
}

BaseArray.prototype.insertByBaseArray = function(idx, element) {
    const elements = this.member.get("elements");
    elements.splice(this.idx(idx), 0, element);
    this.childAs(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseArray.prototype.eraseByBaseArray = function(idx) {
    const element = this.element(idx);
    const elements = this.member.get("elements");
    elements.splice(this.idx(idx), 1);
    this.eraseChild(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseArray.prototype.erase = function(idx) {
    const element = this.element(idx);
    this.eraseByBaseArray(idx);
    element.opacity(0).remove();
    return this;
}

BaseArray.prototype.dropElement = function(idx) {
    const element = this.element(idx);
    this.eraseByBaseArray(idx);
    return element;
}

BaseArray.prototype.dropFirstElement = function() {
    return this.dropElement(this.start());
}

BaseArray.prototype.dropLastElement = function() {
    return this.dropElement(this.end());
}

BaseArray.prototype.dropValue = function(idx) {
    const element = this.element(idx);
    this.eraseByBaseArray(idx);
    const value = element.after(this.delay()).drop();
    element.startAnimate(this).opacity(0).remove();
    return value;
}

BaseArray.prototype.text = function(idx, text) {
    return this.value(idx).text(text);
}

BaseArray.prototype.intValue = function(idx) {
    const value = this.value(idx);
    if (value === undefined) return 0;
    return +this.value(idx).text();
}

BaseArray.prototype.sort = function(comparator = (a, b) => a.intValue() - b.intValue()) {
    const elements = this.member.get("elements");
    elements.sort(comparator);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseArray.prototype.opacity = function() {
    if (arguments.length === 0) {
        return SDNode.prototype.opacity.call(this);
    } else if (arguments.length === 1) {
        const opacity = arguments[0];
        if (0 <= opacity && opacity <= 1) {
            SDNode.prototype.opacity.call(this, opacity);
            return this;
        }
        const idx = arguments[0];
        return this.element(idx).opacity();
    } else if (arguments.length === 2) {
        const idx = arguments[0];
        const opacity = arguments[1];
        this.element(idx).opacity(opacity);
        return this;
    }
    ErrorLauncher.invalidArguments();
}

BaseArray.prototype.value = function() {
    if (arguments.length === 1) {
        const idx = arguments[0];
        return this.element(idx).value();
    } else if (arguments.length === 2) {
        const idx = arguments[0];
        const value = arguments[1];
        this.element(idx).value(value);
        return this;
    }
    ErrorLauncher.invalidArguments();
}

BaseArray.prototype.color = function() {
    if (arguments.length === 1) {
        const idx = arguments[0];
        if (typeof(idx) === "number") return this.element(idx).color();
        const color = arguments[0];
        for (let i = this.start(); i <= this.end(); i++)
            this.element(i).color(color);
        return this;
    } else if (arguments.length === 2) {
        const idx = arguments[0];
        const color = arguments[1];
        this.element(idx).color(color);
        return this;
    } else if (arguments.length === 3) {
        const l = arguments[0];
        const r = arguments[1];
        const color = arguments[2];
        for (let i = l; i <= r; i++)
            this.element(i).color(color);
        return this;
    }
    ErrorLauncher.invalidArguments();
}

BaseArray.prototype.forEachElement = function(callback) {
    const elements = this.member.get("elements");
    elements.forEach((element, id) => {
        callback(element, id);
    });
    return this;
}

BaseArray.prototype.elements = function() {
    const elements = this.member.get("elements");
    return elements;
}