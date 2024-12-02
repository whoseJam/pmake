import { SDNode } from "@/Node/SDNode";

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
            callback(this.children[id], id);
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
        child._.parent = this.node;
        this.children[childName] = child;
        child.rule(rule);
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
        child.triggerExit();
        delete this.children[childName];
        return child;
    }

    has(child) {
        let childName = child;
        if (typeof(child) !== "string" && typeof(child) !== "number") {
            for (let id in this.children)
                if (this.children[id] === child) {
                    childName = id;
                    break;
                }
        }
        if (this.children[childName]) return true;
        return false;
    }
}