import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
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
type GraphMode = "direct" | "undirect";

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

        this.newLayer("nodes");
        this.newLayer("links");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 300,
            height: 300,
            links: [],
            nodes: [],
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
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    }
    nodeId(node: string | number | NodeElement): string {
        return BaseTree.prototype.nodeId.apply(this, arguments);
    }
    nodesId(): Array<string> {
        return BaseTree.prototype.nodesId.apply(this, arguments);
    }
    sourceId(link: LinkElement): string {
        return BaseTree.prototype.sourceId.apply(this, arguments);
    }
    targetId(link: LinkElement): string {
        return BaseTree.prototype.targetId.apply(this, arguments);
    }
    source(link: LinkElement): NodeElement {
        return BaseTree.prototype.source.apply(this, arguments);
    }
    target(link: LinkElement): NodeElement {
        return BaseTree.prototype.target.apply(this, arguments);
    }
    nodes(): Array<NodeElement> {
        return BaseTree.prototype.nodes.apply(this, arguments);
    }
    links(): Array<LinkElement> {
        return BaseTree.prototype.links.apply(this, arguments);
    }
    findNode(condition: NodeCondition<NodeElement>): NodeElement {
        return BaseTree.prototype.findNode.apply(this, arguments);
    }
    findNodes(condition: NodeCondition<NodeElement>): Array<NodeElement> {
        return BaseTree.prototype.findNodes.apply(this, arguments);
    }
    findLink(condition: LinkCondition<LinkElement>): LinkElement {
        return BaseTree.prototype.findLink.apply(this, arguments);
    }
    findLinks(condition: LinkCondition<LinkElement>): Array<LinkElement> {
        return BaseTree.prototype.findLinks.apply(this, arguments);
    }
    findNodeById(id: string | number) {
        return BaseTree.prototype.findNodeById.apply(this, arguments);
    }
    findLinkById(sourceId: string | number, targetId: string | number) {
        return BaseTree.prototype.findLinkById.apply(this, arguments);
    }
    inLinks(node: string | number | NodeElement, mode: GraphMode) {
        const id = this.nodeId(node);
        return this.findLinks((_, sourceId, targetId) => targetId === id || (mode === "undirect" && sourceId === id));
    }
    outLinks(node: string | number | NodeElement, mode: GraphMode) {
        const id = this.nodeId(node);
        return this.findLinks((_, sourceId, targetId) => sourceId === id || (mode === "undirect" && targetId === id));
    }
    toNode(link: LinkElement, source: string | number | NodeElement) {
        const sourceId = this.nodeId(source);
        if (this.sourceId(link) === sourceId) return this.target(link);
        else if (this.targetId(link) === sourceId) return this.source(link);
        else return undefined;
    }
    toNodeId(link: LinkElement, source: string | number | NodeElement) {
        return this.nodeId(this.toNode(link, source));
    }
    inNodes(node: string | number | NodeElement, mode: GraphMode) {
        return this.inLinks(node, mode).map(link => this.toNode(link, node));
    }
    inNodesId(node: string | number | NodeElement, mode: GraphMode) {
        return this.inLinks(node, mode).map(link => this.toNode(link, node));
    }
    outNodes(node: string | number | NodeElement, mode: GraphMode) {
        return this.outLinks(node, mode).map(link => this.toNode(link, node));
    }
    outNodesId(node: string | number | NodeElement, mode: GraphMode) {
        return this.outLinks(node, mode).map(link => this.toNodeId(link, node));
    }
    forEachInNode(node: string | number | NodeElement, mode: GraphMode, callback: NodeCallback<NodeElement>) {
        this.inNodes(node, mode).forEach(node => callback(node, this.nodeId(node)));
    }
    forEachInLink(node: string | number | NodeElement, mode: GraphMode, callback: LinkCallback<LinkElement>) {
        this.inLinks(node, mode).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    }
    forEachOutNode(node: string | number | NodeElement, mode: GraphMode, callback: NodeCallback<NodeElement>) {
        this.outNodes(node, mode).forEach(node => callback(node, this.nodeId(node)));
    }
    forEachOutLink(node: string | number | NodeElement, mode: GraphMode, callback: LinkCallback<LinkElement>) {
        this.outLinks(node, mode).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    }
    forEachNode(callback: NodeCallback<NodeElement>) {
        return BaseTree.prototype.forEachNode.apply(this, arguments);
    }
    forEachLink(callback: LinkCallback<LinkElement>) {
        return BaseTree.prototype.forEachLink.apply(this, arguments);
    }
    link(sourceId: string | number, targetId: string | number, value?: any) {
        return BaseTree.prototype.link.apply(this, arguments);
    }
    abstract newNode(id: string | number, value?: any): this;
    abstract newNodeFromExistValue(id: string | number, value: NodeValue): this;
    abstract newNodeFromExistElement(id: string | number, element: NodeElement): this;
    abstract newLink(sourceId: string | number, targetId: string | number, value?: any): this;
    abstract newLinkFromExistValue(sourceId: string | number, targetId: string | number, value: LinkValue): this;
    abstract newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement): this;
    cut(sourceId: string | number, targetId: string | number) {
        return BaseTree.prototype.cut.apply(this, arguments);
    }
    erase(node: string | number | NodeElement): this;
    erase(source: string | number | NodeElement, target: string | number | NodeElement): this;
    erase() {
        return BaseTree.prototype.erase.apply(this, arguments);
    }
    element(node: string | number | SDNode): NodeElement;
    element(source: string | number | SDNode, target: string | number | SDNode): LinkElement;
    element() {
        return BaseTree.prototype.element.apply(this, arguments);
    }
    opacity() {
        return BaseTree.prototype.opacity.apply(this, arguments);
    }
    nodeOpacity(node: string | number | NodeElement): number;
    nodeOpacity(node: string | number | NodeElement, opacity: number): this;
    nodeOpacity() {
        return BaseTree.prototype.nodeOpacity.apply(this, arguments);
    }
    linkOpacity(source: string | number | NodeElement, target: string | number | NodeElement): number;
    linkOpacity(source: string | number | NodeElement, target: string | number | NodeElement, opacity: number): this;
    linkOpacity() {
        return BaseTree.prototype.linkOpacity.apply(this, arguments);
    }
    color(color: string | SDColor): this;
    color(node: string | number | NodeElement): SDColor;
    color(node: string | number | NodeElement, color: string | SDColor): this;
    color(source: string | number | NodeElement, target: string | number | NodeElement): SDColor;
    color(source: string | number | NodeElement, target: string | number | NodeElement, color: string | SDColor): this;
    color() {
        return BaseTree.prototype.color.apply(this, arguments);
    }
    text(node: string | number | NodeElement): string;
    text(node: string | number | NodeElement, text: string): this;
    text(source: string | number | NodeElement, target: string | number | NodeElement): string;
    text(source: string | number | NodeElement, target: string | number | NodeElement, text: string): this;
    text() {
        return BaseTree.prototype.text.apply(this, arguments);
    }
    nodeText(node: string | number | NodeElement): string;
    nodeText(node: string | number | NodeElement, text: string): this;
    nodeText() {
        return BaseTree.prototype.nodeText.apply(this, arguments);
    }
    linkText(source: string | number | NodeElement, target: string | number | NodeElement): string;
    linkText(source: string | number | NodeElement, target: string | number | NodeElement, text: string): this;
    linkText() {
        return BaseTree.prototype.linkText.apply(this, arguments);
    }
    intValue(node: string | number | NodeElement): number;
    intValue(source: string | number | NodeElement, target: string | number | NodeElement): number;
    intValue() {
        return BaseTree.prototype.intValue.apply(this, arguments);
    }
    value(node: string | number | NodeElement): NodeValue;
    value(node: string | number | NodeElement, value: any): this;
    value(source: string | number | NodeElement, target: string | number | NodeElement): LinkValue;
    value(source: string | number | NodeElement, target: string | number | NodeElement, value: any): this;
    value() {
        return BaseTree.prototype.value.apply(this, arguments);
    }
    nodeValue(node: string | number | NodeElement): NodeValue;
    nodeValue(node: string | number | NodeElement, value?: any): this;
    nodeValue() {
        return BaseTree.prototype.nodeValue.apply(this, arguments);
    }
    linkValue(source: string | number | NodeElement, target: string | number | NodeElement): LinkValue;
    linkValue(source: string | number | NodeElement, target: string | number | NodeElement, value: any): this;
    linkValue() {
        return BaseGraph.prototype.linkValue.apply(this, arguments);
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
