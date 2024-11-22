import { Exit }   from "@/Node/SDNode/Exit";
import { SDNode } from "@/Node/SDNode";

import { Cast }          from "@/Utility/Cast";
import { Check }         from "@/Utility/Check";
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
BaseArray.prototype.updateList = [
    ...BaseArray.prototype.updateList
];

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

BaseArray.prototype.idx = function(id) {
    return id - this.start();
}

BaseArray.prototype.element = function(id) {
    const elements = this.member.get("elements");
    const i = this.idx(id);
    if (0 <= i && i < elements.length)
        return elements[i];
    ErrorLauncher.outOfRangeError(id);
}

BaseArray.prototype.elements = function() {
    const elements = this.member.get("elements");
    return [...elements];
}

BaseArray.prototype.firstElement = function() {
    return this.element(this.start());
}

BaseArray.prototype.lastElement = function() {
    return this.element(this.end());
}

BaseArray.prototype.forEachElement = function(callback) {
    const elements = this.member.get("elements");
    elements.forEach((element, id) => {
        callback(element, id);
    });
    return this;
}

BaseArray.prototype.insertByBaseArray = function(id, element) {
    const elements = this.member.get("elements");
    elements.splice(this.idx(id), 0, element);
    this.childAs(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
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

BaseArray.prototype.eraseByBaseArray = function(id) {
    const element = this.element(id);
    const elements = this.member.get("elements");
    elements.splice(this.idx(id), 1);
    this.eraseChild(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseArray.prototype.pop = function() {
    this.erase(this.end());
    return this;
}

BaseArray.prototype.erase = function(id) {
    const element = this.element(id);
    element.onExit(Exit.naive(this, element));
    this.eraseByBaseArray(id);
    return this;
}

BaseArray.prototype.dropElement = function(id) {
    const element = this.element(id);
    this.eraseByBaseArray(id);
    return element;
}

BaseArray.prototype.dropFirstElement = function() {
    return this.dropElement(this.start());
}

BaseArray.prototype.dropLastElement = function() {
    return this.dropElement(this.end());
}

BaseArray.prototype.dropValue = function(id) {
    const element = this.element(id);
    this.eraseByBaseArray(id);
    const value = element.after(this.delay()).drop();
    element.startAnimate(this).opacity(0).remove();
    return value;
}

BaseArray.prototype.text = function(id, text) {
    if (text === undefined) return this.value(id).text();
    this.value(id).text(text);
    return this;
}

BaseArray.prototype.intValue = function(id) {
    const value = this.value(id);
    if (value === undefined) return 0;
    return +this.value(id).text();
}

BaseArray.prototype.opacity = function() {
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
}

BaseArray.prototype.value = function() {
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
}

BaseArray.prototype.color = function() {
    const args = arguments;
    switch (args.length) {
        case 1:
            if (typeof(args[0]) === "number") return this.element(args[0]).color();
            this.forEachElement(element => element.color(args[0]));
            return this;
        case 2:
            this.element(args[0]).color(args[1]);
            return this;
        case 3:
            for (let i = args[0]; i <= args[1]; i++)
                this.color(i, args[2]);
            return this;
        default:
            ErrorLauncher.invalidArguments();
    }
}

BaseArray.prototype.sort = function(comparator = (a, b) => a.intValue() - b.intValue()) {
    const elements = this.member.get("elements");
    elements.sort(comparator);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}
