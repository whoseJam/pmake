import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithColor, SDNodeWithText, SDNodeWithValue } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rect } from "@/sd";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

function castToId(tree, object) {
    return object instanceof SDNode ? tree.nodeId(object) : object;
}

export abstract class BaseTree<
    NE extends SDNode,
    NV extends SDNode,
    LE extends SDNode,
    LV extends SDNode
> extends SDNode {
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

        this._.sdnodesMap = {}; // SDNode id -> { node: SDNode, id: TreeID } | { link: SDNode, sourceId: TreeID, targetId: TreeID }
        this._.nodesMap = new Map(); // TreeID -> SDNode
        this._.linksMap = new Map(); // TreeID -> SDNode
        this._.nodeType = Vertex;
        this._.linkType = Line;
    }
    x(x?: number) {
        return Rect.prototype.x.apply(this, arguments);
    }
    y(y?: number) {
        return Rect.prototype.y.apply(this, arguments);
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
    nodeId(node: number | string | NE): string {
        if (node === undefined) return undefined;
        if (node instanceof SDNode) {
            if (!this._.sdnodesMap[node.id]) return undefined;
            return this._.sdnodesMap[node.id].id;
        } else {
            if (!this._.nodesMap[String(node)]) return undefined;
            return String(node);
        }
    }
    /**
     * Gets the indexes of all nodes contained within this tree component.
     * @returns An array containing all valid nodes in this component;
     */
    nodesId() {
        return this.vars.nodes.map((node: NE) => this.nodeId(node));
    }
    /**
     * Gets the index of the source node of the link.
     * @param link - The link.
     * @returns The index of the source node of the link.
     */
    sourceId(link: LE) {
        return this.nodeId(this.source(link));
    }
    /**
     * Gets the index of the target node of the link.
     * @param link - The link.
     * @returns The index of the target node of the link.
     */
    targetId(link: LE) {
        return this.nodeId(this.target(link));
    }
    /**
     * Gets the source node of the link.
     * @param link - The link.
     * @returns The source node of the link.
     */
    source(link: LE) {
        if (link === undefined) return undefined;
        if (!this._.sdnodesMap[link.id]) return undefined;
        return this.element(this._.sdnodesMap[link.id].sourceId);
    }
    /**
     * Gets the target node of the link.
     * @param link - The link.
     * @returns The target node of the link.
     */
    target(link: LE) {
        if (link === undefined) return undefined;
        if (!this._.sdnodesMap[link.id]) return undefined;
        return this.element(this._.sdnodesMap[link.id].targetId);
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
    findNode(condition) {
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) return node;
        return undefined;
    }
    /**
     * Gets the nodes that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching nodes.
     */
    findNodes(condition) {
        const nodes = [];
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) nodes.push(node);
        return nodes;
    }
    /**
     * Gets the link that matches the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns The first matching node, or undefined if no match is found.
     */
    findLink(condition) {
        for (const link of this.vars.links) if (condition(link, this.sourceId(link), this.targetId(link))) return link;
        return undefined;
    }
    /**
     * Gets the links that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching links.
     */
    findLinks(condition) {
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
    findNodeById(id) {
        const _id = String(id);
        return this.findNode((_, id) => id === _id);
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
    inLink(node: string | number | NE): LE {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLink((_1, _2, targetId) => targetId === id);
    }
    outLinks(node: string | number | NE): Array<LE> {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLinks((_1, sourceId, _2) => sourceId === id);
    }
    father(node: string | number | NE): NE {
        return this.source(this.inLink(node));
    }
    fatherId(node: string | number | NE): string {
        return this.sourceId(this.inLink(node));
    }
    ancestor(node: string | number | NE, kth: number): NE {
        node = this.element(node);
        while (kth > 0 && node !== undefined) (node = this.father(node)), kth--;
        return node;
    }
    ancestorId(node: string | number | NE, kth: number): string {
        return this.nodeId(this.ancestor(node, kth));
    }
    depth(): number;
    depth(node: string | number | NE): number;
    depth(node?: string | number | NE) {
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
    lca(source: number | string | NE, target: number | string | NE): NE {
        let [_x, _y, dx, dy] = [this.nodeId(source), this.nodeId(target), this.depth(source), this.depth(target)];
        if (_x === undefined) ErrorLauncher.nodeNotFound(source);
        if (_y === undefined) ErrorLauncher.nodeNotFound(target);
        for (let i = 1; i <= 100 && _x !== _y; i++) {
            if (dx > dy) (_x = this.fatherId(_x)), dx--;
            else (_y = this.fatherId(_y)), dy--;
        }
        if (_x !== _y) ErrorLauncher.lcaNotFound();
        return this.findNodeById(_x);
    }
    /**
     * Gets the index of the LCA of two nodes in this tree component.
     * @param source - The first node.
     * @param target - The second node.
     * @returns The current component instance for method chaining.
     */
    lcaId(x: number | string | NE, y: number | string | NE): string {
        return this.nodeId(this.lca(x, y));
    }
    children(node: number | string | NE): Array<NE> {
        return this.outLinks(node).map(link => this.target(link));
    }
    /**
     * Gets all nodes in the subtree rooted at the specified node.
     * @param node - The root node of the subtree.
     * @returns All nodes in the subtree.
     */
    nodesInSubtree(node: number | string | NE): Array<NE> {
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
    linksInSubtree(node: string | number | NE): Array<LE> {
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
    forEachNodeInSubtree(node: string | number | NE, callback: (node: NE, id: string) => void) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachNodeInSubtree`);
        this.nodesInSubtree(node).forEach(node => {
            callback(node, this.nodeId(node));
        });
        return this;
    }
    /**
     * Iterates over each link in the subtree.
     * @param node - The root node of the subtree.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLinkInSubtree(node: string | number | NE, callback: (link: LE, sourceId: string, targetId: string) => void) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachLinkInSubtree`);
        this.linksInSubtree(node).forEach(link => {
            callback(link, this.sourceId(link), this.targetId(link));
        });
        return this;
    }
    /**
     * Gets all nodes in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @returns All nodes in the path.
     */
    nodesOnPath(source: string | number | NE, target: string | number | NE): Array<NE> {
        source = this.element(source);
        const sourceList = [];
        target = this.element(target);
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
    linksOnPath(source: string | number | NE, target: string | number | NE): Array<LE> {
        source = this.element(source);
        const sourceList = [];
        target = this.element(target);
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
        source: string | number | NE,
        target: string | number | NE,
        callback: (node: NE, id: string) => void
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
        source: string | number | NE,
        target: string | number | NE,
        callback: (link: LE, sourceId: string, targetId: string) => void
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
    forEachNode(callback: (node: NE, id: string) => void) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachNode`);
        this.vars.nodes.forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    /**
     * Iterates over each link.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLink(callback: (link: LE, sourceId: string, targetId: string) => void) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachLink`);
        this.vars.links.forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
    }
    root(): NE;
    root(id: string | number, value?: any): this;
    root(id?: string | number, value?: any) {
        if (arguments.length === 0) return this.findNode(node => this.father(node) === undefined);
        else if (!this.element(id)) return this.newNode(id, value);
        return this.rootAs(id);
    }
    rootAs(id) {
        const dfs = x => {
            const father = this.father(x);
            if (!father) return;
            dfs(father);
            this.__reverseLink(this.nodeId(father), this.nodeId(x));
        };
        dfs(this.element(id));
        this.vars.structure = true;
        return this;
    }
    link(sourceId, targetId, value) {
        this.freeze();
        if (!this.findNodeById(targetId)) this.newNode(targetId);
        if (!this.findNodeById(sourceId)) this.newNode(sourceId);
        this.newLink(sourceId, targetId, value);
        this.unfreeze();
        return this;
    }
    abstract newNode(id: number | string, value?: any): this;
    abstract newNodeFromExistValue(id: number | string, value: NV): this;
    abstract newNodeFromExistElement(id: number | string, element: NE): this;
    abstract newLink(sourceId: number | string, targetId: number | string, value?: any): this;
    abstract newLinkFromExistValue(sourceId: number | string, targetId: number | string, value: LV): this;
    abstract newLinkFromExistElement(sourceId: number | string, targetId: number | string, element: LE): this;
    cut(sourceId: number | string, targetId: number | string) {
        return this.erase(sourceId, targetId);
    }
    erase(node: number | string | NE): this;
    erase(source: number | string | NE, target: number | string | NE): this;
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
    element(node: number | string | NE): NE;
    /**
     * Gets the link at the specified index.
     * @param source - The index of the father node.
     * @param target - The index of the child node.
     * @returns The link at the specified index, or undefined if not found.
     */
    element(source: number | string | NE, target: number | string | NE): LE;
    element() {
        if (arguments.length === 1) {
            const [node] = arguments;
            if (node instanceof SDNode) return node;
            const [id] = arguments;
            return this.findNodeById(id);
        } else {
            const [source, target] = arguments;
            const [sourceId, targetId] = [castToId(this, source), castToId(this, target)];
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
    nodeOpacity(node: number | string | NE): number;
    nodeOpacity(node: number | string | NE, opacity: number): this;
    nodeOpacity(node: number | string | NE, opacity?: number) {
        const element = this.__getNodeWithMethod(node, "opacity") as SDNode;
        if (arguments.length === 1) return element.opacity();
        element.opacity(opacity);
        return this;
    }
    linkOpacity(source: number | string | NE, target: number | string | NE): number;
    linkOpacity(source: number | string | NE, target: number | string | NE, opacity: number): this;
    linkOpacity(source: number | string | NE, target: number | string | NE, opacity?: number) {
        const element = this.__getLinkWithMethod(source, target, "opacity") as SDNode;
        if (arguments.length === 2) return element.opacity();
        element.opacity(opacity);
        return this;
    }
    color(color: string | SDColor): this;
    color(node: number | string | NE): SDColor;
    color(node: number | string | NE, color: string | SDColor): this;
    color(source: number | string | NE, target: number | string | NE): SDColor;
    color(source: number | string | NE, target: number | string | NE, color: string | SDColor): this;
    color() {
        if (arguments.length === 1) {
            if (Check.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachNode((node: unknown) => (node as SDNodeWithColor).color(color));
            } else {
                const [node] = arguments;
                const _node = this.__getNodeWithMethod(node, "color") as SDNodeWithColor;
                return _node.color();
            }
        } else if (arguments.length === 2) {
            if (Check.isColor(arguments[1])) {
                const [node, color] = arguments;
                const _node = this.__getNodeWithMethod(node, "color") as SDNodeWithColor;
                _node.color(color);
                return this;
            } else {
                const [source, target] = arguments;
                const link = this.__getLinkWithMethod(source, target, "color") as SDNodeWithColor;
                return link.color();
            }
        } else {
            const [source, target, color] = arguments;
            const link = this.__getLinkWithMethod(source, target, "color") as SDNodeWithColor;
            link.color(color);
            return this;
        }
    }
    text(node: number | string | NE): string;
    text(node: number | string | NE, text: string): this;
    text(source: number | string | NE, target: number | string | NE): string;
    text(source: number | string | NE, target: number | string | NE, text: string): this;
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
    nodeText(node: number | string | NE): string;
    nodeText(node: number | string | NE, text: string): this;
    nodeText(node: number | string | NE, text?: string) {
        const element = this.__getNodeWithMethod(node, "text") as SDNodeWithText;
        if (arguments.length === 1) return element.text();
        element.text(text);
        return this;
    }
    linkText(source: number | string | NE, target: number | string | NE): string;
    linkText(source: number | string | NE, target: number | string | NE, text: string): this;
    linkText(source: number | string | NE, target: number | string | NE, text?: string) {
        const element = this.__getLinkWithMethod(source, target, "text") as SDNodeWithText;
        if (arguments.length === 2) return element.text();
        element.text(text);
        return this;
    }
    intValue(node: number | string | NE): number;
    intValue(source: number | string | NE, target: number | string | NE): number;
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
    value(node: number | string | NE): NV;
    value(node: number | string | NE, value: any): this;
    value(source: number | string | NE, target: number | string | NE): LV;
    value(source: number | string | NE, target: number | string | NE, value: any): this;
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
    nodeValue(node: number | string | NE): NV;
    nodeValue(node: number | string | NE, value?: any): this;
    nodeValue(node: number | string | NE, value?: any) {
        const element = this.__getNodeWithMethod(node, "value") as SDNodeWithValue;
        if (arguments.length === 1) return element.value();
        element.value(value);
        return this;
    }
    linkValue(source: number | string | NE, target: number | string | NE): LV;
    linkValue(source: number | string | NE, target: number | string | NE, value: any): this;
    linkValue(source: number | string | NE, target: number | string | NE, value?: any) {
        const element = this.__getLinkWithMethod(source, target, "value") as SDNodeWithValue;
        if (arguments.length === 2) return element.value();
        element.value(value);
        return this;
    }
    stratify() {
        const result = {};
        const root = this.root();
        if (!root) return undefined;
        const dfs = (current, depth) => {
            let height = depth;
            const children = [];
            this.children(current).forEach(child => {
                child.depth = current.depth + 1;
                height = Math.max(height, dfs(child, depth + 1));
                children.push(result[this.nodeId(child)]);
            });
            result[this.nodeId(current)] = {
                id: this.nodeId(current),
                children: children,
                depth: depth,
                height: height,
                data: current,
            };
            return height;
        };
        dfs(root, 1);
        return result[this.nodeId(root)];
    }
    linkType(type) {
        if (arguments.length === 0) return this._.linkType;
        this._.linkType = type;
        return this;
    }
    nodeType(type) {
        if (arguments.length === 0) return this._.nodeType;
        this._.nodeType = type;
        return this;
    }
    protected __insertNode(id: string, node: NE) {
        this._.sdnodesMap[node.id] = { node, id };
        this._.nodesMap[id] = node;
        this.childAs(node);
        this.vars.nodes.push(node);
        return this;
    }
    protected __insertLink(sourceId: string, targetId: string, link: LE) {
        this._.sdnodesMap[link.id] = { link, sourceId, targetId };
        this._.linksMap.set([sourceId, targetId], link);
        this.childAs(link);
        this.vars.links.push(link);
        return this;
    }
    protected __reverseLink(sourceId: string, targetId: string) {
        const link = this.element(sourceId, targetId);
        this._.sdnodesMap[link.id] = {
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
    protected __getNodeWithMethod(node: number | string | NE, method: string): unknown {
        const element = this.element(node);
        if (!element) ErrorLauncher.nodeNotFound(node);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    }
    protected __getLinkWithMethod(source: number | string | NE, target: number | string | NE, method: string): unknown {
        const element = this.element(source, target);
        if (!element) ErrorLauncher.linkNotFound(source, target);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    }
}
