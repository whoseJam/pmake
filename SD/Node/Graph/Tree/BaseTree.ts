import { BaseGraph, LinkCallback, NodeCallback } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export abstract class BaseTree<
    NodeElement extends SDNode,
    NodeValue extends SDNode,
    LinkElement extends SDNode,
    LinkValue extends SDNode
> extends BaseGraph<NodeElement, NodeValue, LinkElement, LinkValue> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            structure: false,
        });
    }

    /**
     * Gets the index of the root node.
     * @returns The index of the root node, or undefined if not found.
     */
    rootId() {
        return this.nodeId(this.root());
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
        this.linksOnPath(source, target).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
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
}
