import * as Common from "../Structure/Common";
import { Animation } from "./Animation";
import { Position } from "./Position";
import { Listener } from "./Listener";
import { Field } from "./Field";
import { Group } from "./Group";

let id = 0;
let nodeId = 0;

export function Node(self, node, typeName) {
    self.isDirty = false;
    self.parent = null;
    self.children = {
        node: self,
        children: {},
        child: getChild,
        forEach: iterateChildren,
        push: pushChild,
        erase: eraseChild,
        remove: removeChild,
        update: updateChild
    };
    self.dirty = dirty;
    self.remove = Common.remove;
    self.inRange = Common.inRange;

    self = Field(self);
    self = Group(self, node);
    self = Listener(self);
    self = Animation(self);
    self = Position(self);
    self.id = ++nodeId;

    self.g().attr(typeName);
    self.type = function() {
        return typeName;
    }

    return self;
}

function pushChild() {
    let childId, pos = 0, rule = undefined;
    if (typeof(arguments[pos]) === "number" ||
        typeof(arguments[pos]) === "string") {
        childId = arguments[pos++];
    } else childId = ++id;
    let child = arguments[pos++];
    if (arguments[pos] !== undefined)
        rule = arguments[pos++];
    child.parent = null;
    child.parent = this;
    this.children[childId] = child;
    if (rule) { child.rule = rule; rule(this.node, child); }
    return childId;
}

function eraseChild(child) {
    let children = this.children;
    if (typeof(child) === "object") {
        for (let id in children) {
            if (children[id] === child) {
                delete children[id];
            }
        }
        return child;
    } else {
        let ans = children[child];
        delete children[child];
        return ans;
    }
}

function removeChild(child) {
    child = this.erase(child);
    if (child) child.remove();
}

function getChild(childId) {
    return this.children[childId];
}

function updateChild() {
    let children = this.children;
    for (let id in children) {
        let child = children[id];
        let rule = child.rule;
        child.parent = null;
        if (typeof(rule) === "function") {
            rule(this.node, child);
        }
        if (child.isDirty) {
            child.update();
        }
        child.parent = this;
    }
}

function dirty() {
    let cur = this;
    let prt = this.parent;
    while (prt) {
        cur = prt;
        cur.isDirty = true;
        prt = cur.parent;
    }
}

function iterateChildren(callback) {
    let children = this.children;
    for (let id in children) {
        callback(children[id]);
    }
}