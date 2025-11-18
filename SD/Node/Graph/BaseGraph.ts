import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithColor, SDNodeWithText, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Vertex } from "@/sd";
import { Check } from "@/Utility/Check";
import { Color as C, SDAllColor, SDPacketColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export type NodeCondition<NodeElement> = (node: NodeElement, id: string) => boolean;
export type NodeCallback<NodeElement> = (node: NodeElement, id: string) => void;
export type LinkCondition<LinkElement> = (link: LinkElement, sourceId: string, targetId: string) => boolean;
export type LinkCallback<LinkElement> = (link: LinkElement, sourceId: string, targetId: string) => void;
export type NodeItem = { node: SDNode; id: string };
export type LinkItem = { link: SDNode; sourceId: string; targetId: string };

export abstract class BaseGraph<
    NodeElement extends SDNode,
    NodeValue extends SDNode,
    LinkElement extends SDNode,
    LinkValue extends SDNode
> extends SDNode {
    _: SDNode["_"] & {
        sdMap: { [key: number]: NodeItem | LinkItem };
        nodesMap: Map<string, SDNode>;
        linksMap: Map<[string, string], SDNode>;
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.newLayer("links");
        this.newLayer("nodes");

        this.vars.merge({
            x: 0,
            y: 0,
            links: [],
            nodes: [],
        });

        this._.sdMap = {};
        this._.nodesMap = new Map();
        this._.linksMap = new Map();
        this._.nodeType = Vertex;
        this._.linkType = Line;
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    }
    /**
     * Gets the index of the node.
     * @param node - The node.
     * @returns The index of the node, or undefined if not found.
     */
    nodeId(node: string | number | NodeElement): string {
        if (node === undefined) return undefined;
        if (node instanceof SDNode) return (this._.sdMap[node.id] as NodeItem)?.id;
        const id = String(node);
        return this._.nodesMap[id] ? id : undefined;
    }
    /**
     * Gets the indexes of all nodes contained within this component.
     * @returns An array containing all valid nodes in this component;
     */
    nodesId() {
        return this.vars.nodes.map((node: NodeElement) => this.nodeId(node));
    }
    /**
     * Gets the index of the source node of the link.
     * @param link - The link.
     * @returns The index of the source node of the link.
     */
    sourceId(link: LinkElement) {
        return this.nodeId(this.source(link));
    }
    /**
     * Gets the index of the target node of the link.
     * @param link - The link.
     * @returns The index of the target node of the link.
     */
    targetId(link: LinkElement) {
        return this.nodeId(this.target(link));
    }
    /**
     * Gets the source node of the link.
     * @param link - The link.
     * @returns The source node of the link.
     */
    source(link: LinkElement) {
        if (link === undefined) return undefined;
        return this.element((this._.sdMap[link.id] as LinkItem).sourceId);
    }
    /**
     * Gets the target node of the link.
     * @param link - The link.
     * @returns The target node of the link.
     */
    target(link: LinkElement) {
        if (link === undefined) return undefined;
        return this.element((this._.sdMap[link.id] as LinkItem).targetId);
    }
    /**
     * Gets all nodes contained within this component.
     * @returns An array containing all valid nodes in this component.
     */
    nodes() {
        return [...this.vars.nodes];
    }
    /**
     * Gets all links contained within this component.
     * @returns An array containing all valid links in this component.
     */
    links() {
        return [...this.vars.links];
    }
    /**
     * Gets the node that matches the specified condition
     * @param condition - The predicate function to test each node.
     * @returns The first matching node, or undefined if no match is found.
     */
    findNode(condition: NodeCondition<NodeElement>) {
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) return node;
        return undefined;
    }
    /**
     * Gets the nodes that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching nodes.
     */
    findNodes(condition: NodeCondition<NodeElement>) {
        const nodes = [];
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) nodes.push(node);
        return nodes;
    }
    /**
     * Gets the link that matches the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns The first matching node, or undefined if no match is found.
     */
    findLink(condition: LinkCondition<LinkElement>) {
        for (const link of this.vars.links) if (condition(link, this.sourceId(link), this.targetId(link))) return link;
        return undefined;
    }
    /**
     * Gets the links that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching links.
     */
    findLinks(condition: LinkCondition<LinkElement>) {
        const links = [];
        for (const link of this.vars.links)
            if (condition(link, this.sourceId(link), this.targetId(link))) links.push(link);
        return links;
    }
    /**
     * Gets the node at the specified index.
     * @param node - The index of the specified node.
     * @returns The node at the specified index, or undefined if not found.
     */
    findNodeById(id: string | number) {
        const id_ = String(id);
        return this.findNode((_, id) => id === id_);
    }
    /**
     * Gets the link at the specified index.
     * @param source - The index of the father node.
     * @param target - The index of the child node.
     * @returns The link at the specified index, or undefined if not found.
     */
    findLinkById(sourceId: string | number, targetId: string | number) {
        const [_sourceId, _targetId] = [String(sourceId), String(targetId)];
        return this.findLink((_, sourceId, targetId) => sourceId === _sourceId && targetId === _targetId);
    }
    /**
     * Iterates over each node.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNode(callback: NodeCallback<NodeElement>) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachNode`);
        this.vars.nodes.forEach((node: NodeElement) => callback(node, this.nodeId(node)));
        return this;
    }
    /**
     * Iterates over each link.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLink(callback: LinkCallback<LinkElement>) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachLink`);
        this.vars.links.forEach((link: LinkElement) => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
    }
    link(sourceId: string | number, targetId: string | number, value?: any) {
        this.freeze();
        if (!this.findNodeById(targetId)) this.newNode(targetId);
        if (!this.findNodeById(sourceId)) this.newNode(sourceId);
        this.newLink(sourceId, targetId, value);
        this.unfreeze();
        return this;
    }
    newNode(id: string | number, value?: any): this {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue): this {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement): this {
        element.onEnter(EN.moveTo("nodes"));
        return this.__insertNode(String(id), element);
    }

    newLink(sourceId: string | number, targetId: string | number, value?: any) {
        const element = this.__createLinkInstance<LinkElement & SDNodeWithValue>();
        element.value(value);
        element.onEnter(EN.appear("links"));
        return this.__insertLink(String(sourceId), String(targetId), element);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: any) {
        const element = this.__createLinkInstance<LinkElement & SDNodeWithValueFromExist>();
        element.onEnter(EN.appear("links"));
        element.valueFromExist(value.onEnter(EN.moveTo()));
        return this.__insertLink(String(sourceId), String(targetId), element);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement) {
        element.onEnter(EN.moveTo("links"));
        return this.__insertLink(String(sourceId), String(targetId), element);
    }
    cut(sourceId: string | number, targetId: string | number) {
        return this.erase(sourceId, targetId);
    }
    erase(node: string | number | NodeElement): this;
    erase(source: string | number | NodeElement, target: string | number | NodeElement): this;
    erase() {
        if (arguments.length === 1) {
            const [node] = arguments;
            return this.__eraseNode(this.nodeId(node));
        } else {
            const [source, target] = arguments;
            return this.__eraseLink(this.nodeId(source), this.nodeId(target));
        }
    }
    /**
     * Gets the node at the specified index.
     * @param node - The index of the specified node.
     * @returns The node at the specified index, or undefined if not found.
     */
    element(node: string | number | NodeElement): NodeElement;
    /**
     * Gets the link at the specified index.
     * @param source - The index of the father node.
     * @param target - The index of the child node.
     * @returns The link at the specified index, or undefined if not found.
     */
    element(source: string | number | NodeElement, target: string | number | NodeElement): LinkElement;
    element() {
        if (arguments.length === 1) {
            const [node] = arguments;
            if (node instanceof SDNode) return node;
            const [id] = arguments;
            return this.findNodeById(id);
        } else {
            const [source, target] = arguments;
            const sourceId = source instanceof SDNode ? this.nodeId(source as NodeElement) : source;
            const targetId = target instanceof SDNode ? this.nodeId(target as NodeElement) : target;
            return this.findLinkById(sourceId, targetId);
        }
    }
    opacity() {
        if (arguments.length === 0) {
            return SDNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            if (Check.isOpacity(arguments[0])) {
                const [opacity] = arguments;
                return SDNode.prototype.opacity.call(this, opacity);
            } else {
                const [node] = arguments;
                return this.nodeOpacity(node);
            }
        } else if (arguments.length === 2) {
            if (Check.isOpacity(arguments[1])) {
                const [node, opacity] = arguments;
                return this.nodeOpacity(node, opacity);
            } else {
                const [source, target] = arguments;
                return this.linkOpacity(source, target);
            }
        } else {
            const [source, target, opacity] = arguments;
            return this.linkOpacity(source, target, opacity);
        }
    }
    nodeOpacity(node: string | number | NodeElement): number;
    nodeOpacity(node: string | number | NodeElement, opacity: number): this;
    nodeOpacity(node: string | number | NodeElement, opacity?: number) {
        const element = this.__getNodeWithMethod<NodeElement>(node, "opacity");
        if (arguments.length === 1) return element.opacity();
        element.opacity(opacity);
        return this;
    }
    linkOpacity(source: string | number | NodeElement, target: string | number | NodeElement): number;
    linkOpacity(source: string | number | NodeElement, target: string | number | NodeElement, opacity: number): this;
    linkOpacity(source: string | number | NodeElement, target: string | number | NodeElement, opacity?: number) {
        const element = this.__getLinkWithMethod<LinkElement>(source, target, "opacity");
        if (arguments.length === 2) return element.opacity();
        element.opacity(opacity);
        return this;
    }

    color(color: SDAllColor): this;
    color(node: string | number | NodeElement): SDPacketColor;
    color(node: string | number | NodeElement, color: SDAllColor): this;
    color(source: string | number | NodeElement, target: string | number | NodeElement): SDPacketColor;
    color(source: string | number | NodeElement, target: string | number | NodeElement, color: SDAllColor): this;
    color() {
        if (arguments.length === 1) {
            if (C.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachNode((node: unknown) => (node as SDNodeWithColor).color(color));
            } else {
                const [node] = arguments;
                const _node = this.__getNodeWithMethod<SDNodeWithColor>(node, "color");
                return _node.color();
            }
        } else if (arguments.length === 2) {
            if (C.isColor(arguments[1])) {
                const [node, color] = arguments;
                const _node = this.__getNodeWithMethod<SDNodeWithColor>(node, "color");
                _node.color(color);
                return this;
            } else {
                const [source, target] = arguments;
                const link = this.__getLinkWithMethod<SDNodeWithColor>(source, target, "color");
                return link.color();
            }
        } else {
            const [source, target, color] = arguments;
            const link = this.__getLinkWithMethod<SDNodeWithColor>(source, target, "color");
            link.color(color);
            return this;
        }
    }

    text(node: string | number | NodeElement): string;
    text(node: string | number | NodeElement, text: string): this;
    text(source: string | number | NodeElement, target: string | number | NodeElement): string;
    text(source: string | number | NodeElement, target: string | number | NodeElement, text: string): this;
    text() {
        if (arguments.length === 1) {
            const [node] = arguments;
            return this.nodeText(node);
        } else if (arguments.length === 2) {
            const [source, target] = arguments;
            if (this.element(source, target)) {
                return this.linkText(source, target);
            } else {
                const [node, text] = arguments;
                return this.nodeText(node, text);
            }
        } else {
            const [source, target, text] = arguments;
            return this.linkText(source, target, text);
        }
    }
    nodeText(node: string | number | NodeElement): string;
    nodeText(node: string | number | NodeElement, text: string): this;
    nodeText(node: string | number | NodeElement, text?: string) {
        const element = this.__getNodeWithMethod<SDNodeWithText>(node, "text");
        if (arguments.length === 1) return element.text();
        element.text(text);
        return this;
    }
    linkText(source: string | number | NodeElement, target: string | number | NodeElement): string;
    linkText(source: string | number | NodeElement, target: string | number | NodeElement, text: string): this;
    linkText(source: string | number | NodeElement, target: string | number | NodeElement, text?: string) {
        const element = this.__getLinkWithMethod(source, target, "text") as SDNodeWithText;
        if (arguments.length === 2) return element.text();
        element.text(text);
        return this;
    }
    intValue(node: string | number | NodeElement): number;
    intValue(source: string | number | NodeElement, target: string | number | NodeElement): number;
    intValue() {
        let element = undefined;
        if (arguments.length === 1) {
            const [node] = arguments;
            const _node = this.element(node);
            if (!_node) ErrorLauncher.nodeNotFound(node);
            element = _node;
        } else {
            const [source, target] = arguments;
            const link = this.element(source, target);
            if (!link) ErrorLauncher.linkNotFound(source, target);
            element = link;
        }
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    }
    value(node: string | number | NodeElement): NodeValue;
    value(node: string | number | NodeElement, value: any): this;
    value(source: string | number | NodeElement, target: string | number | NodeElement): LinkValue;
    value(source: string | number | NodeElement, target: string | number | NodeElement, value: any): this;
    value() {
        if (arguments.length === 1) {
            const [node] = arguments;
            return this.nodeValue(node);
        } else if (arguments.length === 2) {
            const [source, target] = arguments;
            if (this.element(source, target)) {
                return this.linkValue(source, target);
            } else {
                const [node, value] = arguments;
                return this.nodeValue(node, value);
            }
        } else if (arguments.length === 3) {
            const [source, target, value] = arguments;
            return this.linkValue(source, target, value);
        }
    }
    nodeValue(node: string | number | NodeElement): NodeValue;
    nodeValue(node: string | number | NodeElement, value?: any): this;
    nodeValue(node: string | number | NodeElement, value?: any) {
        const element = this.__getNodeWithMethod<SDNodeWithValue>(node, "value");
        if (arguments.length === 1) return element.value();
        element.value(value);
        return this;
    }
    linkValue(source: string | number | NodeElement, target: string | number | NodeElement): LinkValue;
    linkValue(source: string | number | NodeElement, target: string | number | NodeElement, value: any): this;
    linkValue(source: string | number | NodeElement, target: string | number | NodeElement, value?: any) {
        const element = this.__getLinkWithMethod<SDNodeWithValue>(source, target, "value");
        if (arguments.length === 2) return element.value();
        element.value(value);
        return this;
    }
    hasNode(node: string | number | NodeElement) {
        return this.element(node) !== undefined;
    }
    hasLink(source: string | number | NodeElement, target: string | number | NodeElement) {
        return this.element(source, target) !== undefined;
    }
    nodeType(clazz: new (...args: any[]) => SDNode) {
        this._.nodeType = clazz;
        return this;
    }
    linkType(clazz: new (...args: any[]) => SDNode) {
        this._.linkType = clazz;
        return this;
    }
    __createNodeInstance<T>(): T {
        const nodeClass = this._.nodeType;
        const element = new nodeClass(this.layer("nodes")).opacity(0);
        return element as unknown as T;
    }
    __createLinkInstance<T>(): T {
        const linkClass = this._.linkType;
        const element = new linkClass(this.layer("links")).opacity(0);
        return element as unknown as T;
    }
    __insertNode(id: string, node: NodeElement) {
        this._.sdMap[node.id] = { node, id };
        this._.nodesMap[id] = node;
        this.childAs(node);
        this.vars.nodes.push(node);
        return this;
    }
    __insertLink(sourceId: string, targetId: string, link: LinkElement) {
        this._.sdMap[link.id] = { link, sourceId, targetId };
        this._.linksMap.set([sourceId, targetId], link);
        this.childAs(link);
        this.vars.links.push(link);
        return this;
    }
    __eraseNode(id: string) {
        this._.nodesMap.delete(id);
        const node = this.element(id);
        const nodes = this.vars.nodes;
        nodes.splice(nodes.indexOf(node), 1);
        this.eraseChild(node);
        return this;
    }
    __eraseLink(sourceId: string, targetId: string) {
        this._.linksMap.delete([sourceId, targetId]);
        const link = this.findLinkById(sourceId, targetId);
        const links = this.vars.links;
        links.splice(links.indexOf(link), 1);
        this.eraseChild(link);
        return this;
    }
    __getNodeWithMethod<T>(node: string | number | NodeElement, method: string): T {
        const element = this.element(node);
        if (!element) ErrorLauncher.nodeNotFound(node);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element as unknown as T;
    }
    __getLinkWithMethod<T>(
        source: string | number | NodeElement,
        target: string | number | NodeElement,
        method: string
    ): T {
        const element = this.element(source, target);
        if (!element) ErrorLauncher.linkNotFound(source, target);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element as unknown as T;
    }
}
