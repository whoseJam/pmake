import { BasePath } from "@/Node/Path/BasePath";
import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";

export class BaseTree<NodeElement extends SD2DNode, NodeValue extends SD2DNode, LinkElement extends BasePath, LinkValue extends SD2DNode> extends SD2DNode {
    /**
     * Gets all nodes contained within this tree component.
     * @returns An array containing all valid nodes in this component.
     */
    nodes(): Array<NodeElement>;
    /**
     * Gets the indexes of all nodes contained within this tree component.
     * @returns An array containing all valid nodes in this component;
     */
    nodesId(): Array<string>;
    /**
     * Gets the node at the specified index.
     * @param node - The index of the specified node.
     * @returns The node at the specified index, or undefined if not found.
     */
    element(node: number | string | NodeElement): NodeElement | undefined;
    /**
     * Gets the root node of this tree component.
     * @returns The root node, or undefined if not found.
     */
    root(): NodeElement | undefined;
    /**
     * Gets the index of the root node.
     * @returns The index of the root node, or undefined if not found.
     */
    rootId(): string | undefined;
    /**
     * Gets the index of the node.
     * @param node - The node.
     * @returns The index of the node, or undefined if not found.
     */
    nodeId(node: number | string | NodeElement): string | undefined;
    /**
     * Gets all links contained within this tree component.
     * @returns An array containing all valid links in this component.
     */
    links(): Array<LinkElement>;
    /**
     * Gets the link at the specified index.
     * @param source - The index of the father node.
     * @param target - The index of the child node.
     * @returns The link at the specified index, or undefined if not found.
     */
    element(source: number | string | NodeElement, target: number | string | NodeElement): LinkElement | undefined;
    /**
     * Gets the source node of the link.
     * @param link - The link.
     * @returns The source node of the link.
     */
    source(link: LinkElement): NodeElement | undefined;
    /**
     * Gets the target node of the link.
     * @param link - The link.
     * @returns The target node of the link.
     */
    target(link: LinkElement): NodeElement | undefined;
    /**
     * Gets the index of the source node of the link.
     * @param link - The link.
     * @returns The index of the source node of the link.
     */
    sourceId(link: LinkElement): string | undefined;
    /**
     * Gets the index of the target node of the link.
     * @param link - The link.
     * @returns The index of the target node of the link.
     */
    targetId(link: LinkElement): string | undefined;
    /**
     * Gets the node that matches the specified condition
     * @param condition - The predicate function to test each node.
     * @returns The first matching node, or undefined if no match is found.
     */
    findNode(condition: (node: NodeElement, id: string) => boolean): NodeElement | undefined;
    /**
     * Gets the nodes that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching nodes.
     */
    findNodes(condition: (node: NodeElement, id: string) => boolean): Array<NodeElement>;
    /**
     * Gets the link that matches the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns The first matching node, or undefined if no match is found.
     */
    findLink(condition: (link: LinkElement, sourceId: string, targetId: string) => boolean): LinkElement | undefined;
    /**
     * Gets the links that match the specified condition.
     * @param condition - The predicate function to test each node.
     * @returns All the matching links.
     */
    findLinks(condition: (link: LinkElement, sourceId: string, targetId: string) => boolean): Array<LinkElement>;
    /**
     * Gets the node at the specified index.
     * @param node - The index of the specified node.
     * @returns The node at the specified index, or undefined if not found.
     */
    findNodeById(id: number | string): NodeElement | undefined;
    /**
     * Gets the link at the specified index.
     * @param source - The index of the father node.
     * @param target - The index of the child node.
     * @returns The link at the specified index, or undefined if not found.
     */
    findLinkById(sourceId: number | string, targetId: number | string): LinkElement | undefined;
    inLink(node: number | string | NodeElement): LinkElement | undefined;
    outLinks(node: number | string | NodeElement): Array<LinkElement>;
    children(node: number | string | NodeElement): Array<LinkElement>;
    father(node: number | string | NodeElement): NodeElement | undefined;
    fatherId(node: number | string | NodeElement): string | undefined;
    depth(): number;
    depth(node: number | string | NodeElement): number;
    ancestor(node: number | string | NodeElement, kth: number): NodeElement | undefined;
    ancestorId(node: number | string | NodeElement, kth: number): string | undefined;
    /**
     * Gets the LCA of two nodes in this tree component.
     * @param source - The first node.
     * @param target - The second node.
     * @returns The current component instance for method chaining.
     */
    lca(source: number | string | NodeElement, target: number | string | NodeElement): NodeElement;
    /**
     * Gets the index of the LCA of two nodes in this tree component.
     * @param source - The first node.
     * @param target - The second node.
     * @returns The current component instance for method chaining.
     */
    lcaId(source: number | string | NodeElement, target: number | string | NodeElement): string;
    /**
     * Gets all nodes in the subtree rooted at the specified node.
     * @param node - The root node of the subtree.
     * @returns All nodes in the subtree.
     */
    nodesInSubtree(node: number | string | NodeElement): Array<NodeElement>;
    /**
     * Gets all nodes in the subtree rooted at the specified node.
     * @param node - The root node of the subtree.
     * @returns All links in the subtree.
     */
    linksInSubtree(node: number | string | LinkElement): Array<LinkElement>;
    /**
     * Iterates over each node in the subtree.
     * @param node - The root node of the subtree.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNodeInSubtree(node: number | string | NodeElement, callback: (node: NodeElement, id: string) => void): this;
    /**
     * Iterates over each link in the subtree.
     * @param node - The root node of the subtree.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLinkInSubtree(node: number | string | NodeElement, callback: (link: LinkElement, sourceId: string, targetId: string) => void): this;
    /**
     * Gets all nodes in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @returns All nodes in the path.
     */
    nodesOnPath(source: number | string | NodeElement, target: number | string | NodeElement): Array<NodeElement>;
    /**
     * Gets all links in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @returns All links in the path.
     */
    linksOnPath(source: number | string | NodeElement, target: number | string | NodeElement): Array<LinkElement>;
    /**
     * Iterates over each node in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNodeOnPath(source: number | string | NodeElement, target: number | string | NodeElement, callback: (node: NodeElement, id: string) => void): this;
    /**
     * Iterates over each node in the path.
     * @param source - The starting node of the path.
     * @param target - The ending node of the path.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLinkOnPath(source: number | string | NodeElement, target: number | string | NodeElement, callback: (link: LinkElement, sourceId: string, targetId: string) => void): this;
    /**
     * Iterates over each node.
     * @param callback - A function to execute for each node.
     * @returns The current component instance for method chaining.
     */
    forEachNode(callback: (node: NodeElement, id: string) => void): this;
    /**
     * Iterates over each link.
     * @param callback - A function to execute for each link.
     * @returns The current component instance for method chaining.
     */
    forEachLink(callback: (link: LinkElement, sourceId: string, targetId: string) => void): this;
    root(id: number | string, value?: any): this;
    rootAs(node: number | string | NodeElement): this;
    link(sourceId: number | string, targetId: number | string, value?: any): this;
    newNode(id: number | string, value?: any): this;
    newNodeFromExistValue(id: number | string, value: NodeValue): this;
    newNodeFromExistElement(id: number | string, element: NodeElement): this;
    newLink(sourceId: number | string, targetId: number | string, value?: any): this;
    newLinkFromExistValue(sourceId: number | string, targetId: number | string, value: LinkValue): this;
    newLinkFromExistElement(sourceId: number | string, targetId: number | string, element: LinkElement): this;
    cut(sourceId: number | string, targetId: number | string): this;
    erase(node: number | string | NodeElement): this;
    erase(source: number | string | NodeElement, target: number | string | NodeElement): this;

    opacity(node: number | string | NodeElement): number;
    opacity(node: number | string | NodeElement, opacity: number): this;
    nodeOpacity(node: number | string | NodeElement): number;
    nodeOpacity(node: number | string | NodeElement, opacity: number): this;
    opacity(source: number | string | NodeElement, target: number | string | NodeElement): number;
    opacity(source: number | string | NodeElement, target: number | string | NodeElement, opacity: number): this;
    linkOpacity(source: number | string | NodeElement, target: number | string | NodeElement): number;
    linkOpacity(source: number | string | NodeElement, target: number | string | NodeElement): number;
    color(color: string | SDColor): this;
    color(node: number | string | NodeElement): SDColor;
    color(node: number | string | NodeElement, color: string | SDColor): this;
    color(source: number | string | NodeElement, target: number | string | NodeElement): SDColor;
    color(source: number | string | NodeElement, target: number | string | NodeElement, color: string | SDColor): this;
    text(node: number | string | NodeElement): string;
    text(node: number | string | NodeElement, text: string): this;
    nodeText(node: number | string | NodeElement): string;
    nodeText(node: number | string | NodeElement, text: string): this;
    text(source: number | string | NodeElement, target: number | string | NodeElement): string;
    text(source: number | string | NodeElement, target: number | string | NodeElement, text: string): this;
    linkText(source: number | string | NodeElement, target: number | string | NodeElement): string;
    linkText(source: number | string | NodeElement, target: number | string | NodeElement, text: string): this;
    intValue(node: number | string | NodeElement): number;
    intValue(source: number | string | NodeElement, target: number | string | NodeElement): number;
    value(node: number | string | NodeElement): NodeValue | undefined;
    value(node: number | string | NodeElement, value: any): this;
    nodeValue(node: number | string | NodeElement): NodeValue | undefined;
    nodeValue(node: number | string | NodeValue, value: any): this;
    value(source: number | string | NodeElement, target: number | string | NodeElement): LinkValue | undefined;
    value(source: number | string | NodeElement, target: number | string | NodeElement, value: any): this;
    linkValue(source: number | string | NodeElement, target: number | string | NodeElement): LinkValue | undefined;
    linkValue(source: number | string | NodeElement, target: number | string | NodeElement, value: any): this;

    linkType(type: any): this;
    nodeType(type: any): this;
}
