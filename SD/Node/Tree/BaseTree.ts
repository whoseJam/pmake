import { SDNode, SDNodeWithColor, SDNodeWithText, SDNodeWithValue } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

type NodeCondition<NodeElement> = (node: NodeElement, id: string) => boolean;
type NodeCallback<NodeElement> = (node: NodeElement, id: string) => void;
type LinkCondition<LinkElement> = (link: LinkElement, sourceId: string, targetId: string) => boolean;
type LinkCallback<LinkElement> = (link: LinkElement, sourceId: string, targetId: string) => void;
type NodeItem = { node: SDNode; id: string };
type LinkItem = { link: SDNode; sourceId: string; targetId: string };

export abstract class BaseTree<
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
            structure: false,
        });

        this._.sdMap = {};
        this._.nodesMap = new Map();
        this._.linksMap = new Map();
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
     * Gets the index of the root node.
     * @returns The index of the root node, or undefined if not found.
     */
    rootId() {
        return this.nodeId(this.root());
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
     * Gets the indexes of all nodes contained within this tree component.
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
     * Gets all nodes contained within this tree component.
     * @returns An array containing all valid nodes in this component.
     */
    nodes() {
        return [...this.vars.nodes];
    }
    /**
     * Gets all links contained within this tree component.
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
    inLink(node: string | number | NodeElement): LinkElement {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLink((_1, _2, targetId) => targetId === id);
    }
    outLinks(node: string | number | NodeElement): Array<LinkElement> {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLinks((_1, sourceId, _2) => sourceId === id);
    }
    father(node: string | number | NodeElement): NodeElement {
        return this.source(this.inLink(node));
    }
    fatherId(node: string | number | NodeElement): string {
        return this.sourceId(this.inLink(node));
    }
    ancestor(node: string | number | NodeElement, kth: number): NodeElement {
        node = this.element(node);
        while (kth > 0 && node !== undefined) (node = this.father(node)), kth--;
        return node;
    }
    ancestorId(node: string | number | NodeElement, kth: number): string {
        return this.nodeId(this.ancestor(node, kth));
    }
    depth(): number;
    depth(node: string | number | NodeElement): number;
    depth(node?: string | number | NodeElement) {
        if (arguments.length === 0) {
            let depth = 0;
            this.forEachNode(node => (depth = Math.max(depth, this.depth(node))));
            return depth;
        }
        let depth = 1;
        while (this.father(node)) (node = this.father(node)), depth++;
        return depth;
    }
    /**
     * Gets the LCA of two nodes in this tree component.
     * @param source - The first node.
     * @param target - The second node.
     * @returns The current component instance for method chaining.
     */
    lca(source: string | number | NodeElement, target: string | number | NodeElement): NodeElement {
        let [x, y, dx, dy] = [this.nodeId(source), this.nodeId(target), this.depth(source), this.depth(target)];
        if (x === undefined) ErrorLauncher.nodeNotFound(source);
        if (y === undefined) ErrorLauncher.nodeNotFound(target);
        for (let i = 1; i <= 100 && x !== y; i++) {
            if (dx > dy) (x = this.fatherId(x)), dx--;
            else (y = this.fatherId(y)), dy--;
        }
        if (x !== y) ErrorLauncher.lcaNotFound();
        return this.findNodeById(x);
    }
    /**
     * Gets the index of the LCA of two nodes in this tree component.
     * @param source - The first node.
     * @param target - The second node.
     * @returns The current component instance for method chaining.
     */
    lcaId(x: string | number | NodeElement, y: string | number | NodeElement): string {
        return this.nodeId(this.lca(x, y));
    }
    children(node: string | number | NodeElement): Array<NodeElement> {
        return this.outLinks(node).map(link => this.target(link));
    }
    /**
     * Gets all nodes in the subtree rooted at the specified node.
     * @param node - The root node of the subtree.
     * @returns All nodes in the subtree.
     */
    nodesInSubtree(node: string | number | NodeElement): Array<NodeElement> {
        node = this.element(node);
        const nodeList = [];
        const dfs = node => {
            nodeList.push(node);
            const children = this.children(node);
            children.forEach(child => {
                dfs(child);
            });
        };
        dfs(node);
        return nodeList;
    }
    /**
     * Gets all nodes in the subtree rooted at the specified node.
     * @param node - The root node of the subtree.
     * @returns All links in the subtree.
     */
    linksInSubtree(node: string | number | NodeElement): Array<LinkElement> {
        node = this.element(node);
        const linkList = [];
        const dfs = node => {
            const children = this.children(node);
            children.forEach(child => {
                linkList.push(this.element(node, child));
                dfs(child);
            });
        };
        dfs(node);
        return linkList;
    }
    /**
     * Iterates over each node in the subtree.
     * @param node - The root node of the subtree.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNodeInSubtree(node: string | number | NodeElement, callback: NodeCallback<NodeElement>) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachNodeInSubtree`);
        this.nodesInSubtree(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    /**
     * Iterates over each link in the subtree.
     * @param node - The root node of the subtree.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLinkInSubtree(node: string | number | NodeElement, callback: LinkCallback<LinkElement>) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachLinkInSubtree`);
        this.linksInSubtree(node).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
    }
    /**
     * Gets all nodes in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @returns All nodes in the path.
     */
    nodesOnPath(source: string | number | NodeElement, target: string | number | NodeElement): Array<NodeElement> {
        source = this.element(source);
        target = this.element(target);
        const sourceList = [];
        const targetList = [];
        let sourceDepth = this.depth(source);
        let targetDepth = this.depth(target);
        for (let i = 1; i <= 100 && source !== target; i++) {
            if (sourceDepth > targetDepth) {
                sourceList.push(source);
                source = this.father(source);
                sourceDepth--;
            } else {
                targetList.push(target);
                target = this.father(target);
                targetDepth--;
            }
        }
        return [...sourceList, source, ...targetList.reverse()];
    }
    /**
     * Gets all links in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @returns All links in the path.
     */
    linksOnPath(source: string | number | NodeElement, target: string | number | NodeElement): Array<LinkElement> {
        source = this.element(source);
        target = this.element(target);
        const sourceList = [];
        const targetList = [];
        let sourceDepth = this.depth(source);
        let targetDepth = this.depth(target);
        for (let i = 1; i <= 100 && source !== target; i++) {
            if (sourceDepth > targetDepth) {
                sourceList.push(this.element(this.father(source), source));
                source = this.father(source);
                sourceDepth--;
            } else {
                targetList.push(this.element(this.father(target), target));
                target = this.father(target);
                targetDepth--;
            }
        }
        return [...sourceList, ...targetList.reverse()];
    }
    /**
     * Iterates over each node in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNodeOnPath(
        source: string | number | NodeElement,
        target: string | number | NodeElement,
        callback: NodeCallback<NodeElement>
    ): this {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachNodeOnPath`);
        this.nodesOnPath(source, target).forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    /**
     * Iterates over each node in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLinkOnPath(
        source: string | number | NodeElement,
        target: string | number | NodeElement,
        callback: LinkCallback<LinkElement>
    ) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachLinkOnPath`);
        this.linksOnPath(source, target).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
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
    root(): NodeElement;
    root(id: string | number, value?: any): this;
    root(id?: string | number, value?: any) {
        if (arguments.length === 0) return this.findNode(node => this.father(node) === undefined);
        else if (!this.element(id)) return this.newNode(id, value);
        return this.rootAs(id);
    }
    rootAs(node: string | number | NodeElement) {
        const dfs = (x: NodeElement) => {
            const father = this.father(x);
            if (!father) return;
            dfs(father);
            this.__reverseLink(this.nodeId(father), this.nodeId(x));
        };
        dfs(this.element(node));
        this.vars.structure = true;
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
    abstract newNode(id: string | number, value?: any): this;
    abstract newNodeFromExistValue(id: string | number, value: NodeValue): this;
    abstract newNodeFromExistElement(id: string | number, element: NodeElement): this;
    abstract newLink(sourceId: string | number, targetId: string | number, value?: any): this;
    abstract newLinkFromExistValue(sourceId: string | number, targetId: string | number, value: LinkValue): this;
    abstract newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement): this;
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
    color(color: string | SDColor): this;
    color(node: string | number | NodeElement): SDColor;
    color(node: string | number | NodeElement, color: string | SDColor): this;
    color(source: string | number | NodeElement, target: string | number | NodeElement): SDColor;
    color(source: string | number | NodeElement, target: string | number | NodeElement, color: string | SDColor): this;
    color() {
        if (arguments.length === 1) {
            if (Check.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachNode((node: unknown) => (node as SDNodeWithColor).color(color));
            } else {
                const [node] = arguments;
                const _node = this.__getNodeWithMethod<SDNodeWithColor>(node, "color");
                return _node.color();
            }
        } else if (arguments.length === 2) {
            if (Check.isColor(arguments[1])) {
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
        const element = this.__getNodeWithMethod(node, "text") as SDNodeWithText;
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
    protected __insertNode(id: string, node: NodeElement) {
        this._.sdMap[node.id] = { node, id };
        this._.nodesMap[id] = node;
        this.childAs(node);
        this.vars.nodes.push(node);
        return this;
    }
    protected __insertLink(sourceId: string, targetId: string, link: LinkElement) {
        this._.sdMap[link.id] = { link, sourceId, targetId };
        this._.linksMap.set([sourceId, targetId], link);
        this.childAs(link);
        this.vars.links.push(link);
        return this;
    }
    protected __reverseLink(sourceId: string, targetId: string) {
        const link = this.element(sourceId, targetId);
        this._.sdMap[link.id] = {
            link,
            sourceId: targetId,
            targetId: sourceId,
        };
        this._.linksMap.delete([sourceId, targetId]);
        this._.linksMap.set([targetId, sourceId], link);
        return this;
    }
    protected __eraseNode(id: string) {
        this._.nodesMap.delete(id);
        const node = this.element(id);
        const nodes = this.vars.nodes;
        nodes.splice(nodes.indexOf(node), 1);
        this.eraseChild(node);
        return this;
    }
    protected __eraseLink(sourceId: string, targetId: string) {
        this._.linksMap.delete([sourceId, targetId]);
        const link = this.findLinkById(sourceId, targetId);
        const links = this.vars.links;
        links.splice(links.indexOf(link), 1);
        this.eraseChild(link);
        return this;
    }
    protected __getNodeWithMethod<T>(node: string | number | NodeElement, method: string): T {
        const element = this.element(node);
        if (!element) ErrorLauncher.nodeNotFound(node);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element as unknown as T;
    }
    protected __getLinkWithMethod<T>(
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
