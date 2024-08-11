import { SDNode } from "../SDNode";

let id = 0;

export class Children {
    constructor(node) {
        /** @type {SDNode} */
        this.node = node;
        /** @type {Map<number|string, SDNode>} */
        this.children = {};
    }

    /**
     * @param {number|string} childName 
     * @returns {SDNode}
     */
    child(childName) {
        return this.children[childName];
    }


    /**
     * @param {(SDNode) => void} callback 
     */
    forEach(callback) {
        for (let id in this.children)
            callback(this.children[id]);
    }

    /**
     * @overload
     * @param {number|string} childName 
     * @param {SDNode} child 
     * @param {(SDNode, SDNode) => void} rule 
     * @returns {number|string}
     * @overload
     * @param {number|string} childName
     * @param {SDNode} child
     * @returns {number|string}
     * @overload
     * @param {SDNode} child
     * @param {(SDNode, SDNode) => void} rule
     * @returns {number|string}
     * @overload
     * @param {SDNode} child
     * @returns {number|string}
     */
    push(childName, child, rule) {
        if (typeof(childName) !== "string" && typeof(childName) !== "number") {
            childName = ++id;
            child = arguments[0];
            rule = arguments[1] ? arguments[1] : undefined;
        }
        child.parent = this.node;
        this.children[childName] = child;
        if (rule) child._.rule = rule;
        return childName;
    }

    /**
     * @overload
     * @param {number|string} child 
     * @returns {SDNode}
     * @overload
     * @param {SDNode} child
     * @returns {SDNode}
     */
    erase(child) {
        let childName = child;
        if (typeof(child) !== "string" && typeof(child) !== "number") {
            for (let id in this.children)
                if (this.children[id] === child) {
                    childName = id;
                    break;
                }
        }
        child = this.children[childName];
        delete this.children[childName];
        return child;
    }


    /**
     * 
     */
    rule() {
        this.forEach(child => {
            const rule = child._.rule;
            if (!rule) return;
            const move = () => { rule(this.node, child); };
            if (child._.enter) {
                child._.enter(child, move);
                child._.enter = undefined;
            } else move();
        });
    }

    /**
     * 
     */
    update() {
        this.rule(); // WARNING：以后删掉
        this.forEach(child => {
            child.update();
        })
    }
}