import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SDNode, SDNodeWithValue, SDNodeWithValueFromExist } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { TreeEngine } from "@/Node/Tree/TreeEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

type Layout = "vertical" | "horizontal";
type NodeCallback<NodeElement> = (node: NodeElement, id: string) => void;

export class BinaryTree<
    NodeElement extends SDNode = Vertex,
    NodeValue extends SDNode = SDNode,
    LinkElement extends SDNode = Line,
    LinkValue extends SDNode = SDNode
> extends BaseTree<NodeElement, NodeValue, LinkElement, LinkValue> {
    _: BaseTree<NodeElement, NodeValue, LinkElement, LinkValue>["_"] & {
        son: { [key: number]: [string, string] }; // SDNode id -> [leftChildId, rightChildId]
    };
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("BinaryTree");

        this.vars.merge({
            width: 300,
            height: 0,
            layout: "vertical",
            layerGap: 60,
        });

        this._.son = {};

        this.effect("tree", () => {
            const layout = this.layout();
            const [x_, y_] = this.pos("x", "y");
            const gap_ = this.layerGap();
            if (layout === "vertical") {
                this.vars.height = Math.max(0, (this.depth() - 1) * gap_);
                TreeEngine.binaryLayout(this as any, {
                    width: this.width(),
                    location(node) {
                        return [x_ + (node.rank * 2 + 1) * node.gap, y_ + gap_ * node.depth];
                    },
                });
            } else {
                this.vars.width = Math.max(0, (this.depth() - 1) * gap_);
                TreeEngine.binaryLayout(this as any, {
                    width: this.height(),
                    location(node) {
                        return [x_ + gap_ * node.depth, y_ + (node.rank * 2 + 1) * node.gap];
                    },
                });
            }
        });
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        if (this.layout() === "horizontal") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerWidth(width);
            return this.layerWidth(width / depth);
        }
        this.vars.width = width;
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        if (this.layout() === "vertical") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerHeight(height);
            return this.layerHeight(height / depth);
        }
        this.vars.height = height;
        return this;
    }
    link(sourceId: string | number, targetId: string | number, value?: any, type?: 0 | 1) {
        const type_ = type === undefined ? (this.leftChild(sourceId) ? 1 : 0) : type;
        return this[["leftChild", "rightChild"][type_]](sourceId, targetId, value);
    }
    newNode(id: string | number, value?: any) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValue>();
        this._.son[element.id] = [undefined, undefined];
        element.value(SDNode.__asNode(this.layer("nodes"), value, String(id)));
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistValue(id: string | number, value: NodeValue) {
        const element = this.__createNodeInstance<NodeElement & SDNodeWithValueFromExist>();
        element.valueFromExist(value);
        element.onEnter(EN.appear("nodes"));
        return this.__insertNode(String(id), element);
    }
    newNodeFromExistElement(id: string | number, element: NodeElement) {
        element.onEnter(EN.moveTo("nodes"));
        return this.__insertNode(String(id), element);
    }
    newLink(sourceId: string | number, targetId: string | number, value?: any, type?: 0 | 1) {
        const element = this.__createLinkInstance<LinkElement & SDNodeWithValue>();
        element.value(value);
        element.onEnter(EN.appear("links"));
        return this.__insertLink(String(sourceId), String(targetId), element, type);
    }
    newLinkFromExistValue(sourceId: string | number, targetId: string | number, value?: LinkValue, type?: 0 | 1) {
        const element = this.__createLinkInstance<LinkElement & SDNodeWithValueFromExist>();
        element.valueFromExist(value);
        element.onEnter(EN.appear("links"));
        return this.__insertLink(String(sourceId), String(targetId), element, type);
    }
    newLinkFromExistElement(sourceId: string | number, targetId: string | number, element: LinkElement, type?: 0 | 1) {
        element.onEnter(EN.moveTo("links"));
        return this.__insertLink(String(sourceId), String(targetId), element, type);
    }
    leftChild(node: string | number | NodeElement): NodeElement;
    leftChild(sourceId: string | number, targetId: string | number, value?: any): this;
    leftChild(sourceId: string | number | NodeElement, targetId?: string | number, value?: any) {
        if (arguments.length === 1) {
            const node = this.element(arguments[0]);
            return node ? this.findNodeById(this._.son[node.id][0]) : undefined;
        }
        this.freeze();
        const sourceId_ = String(sourceId);
        const targetId_ = String(targetId);
        if (!this.findNodeById(sourceId_)) this.newNode(sourceId_);
        if (!this.findNodeById(targetId_)) this.newNode(targetId_);
        this.newLink(sourceId_, targetId_, value, 0);
        this.unfreeze();
        return this;
    }
    rightChild(node: string | number | NodeElement): NodeElement;
    rightChild(sourceId: string | number, targetId: string | number, value?: any): this;
    rightChild(sourceId: string | number | NodeElement, targetId?: string | number, value?: any) {
        if (arguments.length === 1) {
            const node = this.element(arguments[0]);
            return node ? this.findNodeById(this._.son[node.id][1]) : undefined;
        }
        this.freeze();
        const sourceId_ = String(sourceId);
        const targetId_ = String(targetId);
        if (!this.findNodeById(sourceId_)) this.newNode(sourceId_);
        if (!this.findNodeById(targetId_)) this.newNode(targetId_);
        this.newLink(sourceId_, targetId_, value, 1);
        this.unfreeze();
        return this;
    }
    leftChildId(node: string | number | NodeElement) {
        return this.nodeId(this.leftChild(node));
    }
    rightChildId(node: string | number | NodeElement) {
        return this.nodeId(this.rightChild(node));
    }
    swapChildren(node: string | number | NodeElement) {
        const id = this.nodeId(node);
        const son = this._.son[this.element(id).id];
        [son[0], son[1]] = [son[1], son[0]];
        this.vars.nodes = this.vars.nodes;
        return this;
    }
    nodesOnPreorderTraversal(): Array<NodeElement>;
    nodesOnPreorderTraversal(node: string | number | NodeElement): Array<NodeElement>;
    nodesOnPreorderTraversal(node?: string | number | NodeElement) {
        const nodes = [];
        const traversal = (node: NodeElement) => {
            nodes.push(node);
            if (this.leftChild(node)) traversal(this.leftChild(node));
            if (this.rightChild(node)) traversal(this.rightChild(node));
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    }
    nodesOnInorderTraversal(): Array<NodeElement>;
    nodesOnInorderTraversal(node: string | number | NodeElement): Array<NodeElement>;
    nodesOnInorderTraversal(node?: string | number | NodeElement) {
        const nodes = [];
        const traversal = (node: NodeElement) => {
            if (this.leftChild(node)) traversal(this.leftChild(node));
            nodes.push(node);
            if (this.rightChild(node)) traversal(this.rightChild(node));
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    }
    nodesOnPostorderTraversal(): Array<NodeElement>;
    nodesOnPostorderTraversal(node: string | number | NodeElement): Array<NodeElement>;
    nodesOnPostorderTraversal(node?: string | number | NodeElement) {
        const nodes = [];
        const traversal = (node: NodeElement) => {
            if (this.leftChild(node)) traversal(this.leftChild(node));
            if (this.rightChild(node)) traversal(this.rightChild(node));
            nodes.push(node);
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    }
    forEachNodeOnPreorderTraversal(callback: NodeCallback<NodeElement>): this;
    forEachNodeOnPreorderTraversal(node: string | number | NodeElement, callback: NodeCallback<NodeElement>): this;
    forEachNodeOnPreorderTraversal(
        node: string | number | NodeElement | NodeCallback<NodeElement>,
        callback?: NodeCallback<NodeElement>
    ) {
        if (typeof node === "function") return this.forEachNodeOnPreorderTraversal(this.root(), arguments[0]);
        this.nodesOnPreorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    forEachNodeOnInorderTraversal(callback: NodeCallback<NodeElement>): this;
    forEachNodeOnInorderTraversal(node: string | number | NodeElement, callback: NodeCallback<NodeElement>): this;
    forEachNodeOnInorderTraversal(
        node: string | number | NodeElement | NodeCallback<NodeElement>,
        callback?: NodeCallback<NodeElement>
    ) {
        if (typeof node === "function") return this.forEachNodeOnInorderTraversal(this.root(), arguments[0]);
        this.nodesOnInorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    forEachNodeOnPostorderTraversal(callback: NodeCallback<NodeElement>): this;
    forEachNodeOnPostorderTraversal(node: string | number | NodeElement, callback: NodeCallback<NodeElement>): this;
    forEachNodeOnPostorderTraversal(
        node: string | number | NodeElement | NodeCallback<NodeElement>,
        callback?: NodeCallback<NodeElement>
    ) {
        if (typeof node === "function") return this.forEachNodeOnPostorderTraversal(this.root(), arguments[0]);
        this.nodesOnPostorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    }
    layout(): Layout;
    layout(layout: Layout): this;
    layout(layout?: Layout) {
        if (arguments.length === 0) return this.vars.layout;
        if (this.vars.layout !== layout) {
            this.vars.setTogether({
                layout,
                width: this.vars.height,
                height: this.vars.width,
            });
            return this;
        }
        return this;
    }
    layerGap(): number;
    layerGap(gap: number): this;
    layerGap(gap?: number) {
        if (arguments.length === 0) return this.vars.layerGap;
        Check.validateNumber(gap, `${this.constructor.name}.layerGap`);
        this.vars.lpset("layerGap", gap);
        return this;
    }
    layerWidth(): number;
    layerWidth(width: number): this;
    layerWidth() {
        return this.layerGap.apply(this, arguments);
    }
    layerHeight(): number;
    layerHeight(height: number): this;
    layerHeight() {
        return this.layerGap.apply(this, arguments);
    }
    __createNodeInstance<T>(): T {
        const element = new Vertex(this.layer("nodes")).opacity(0);
        return element as unknown as T;
    }
    __createLinkInstance<T>(): T {
        const element = new Line(this.layer("links")).opacity(0);
        return element as unknown as T;
    }
    __insertLink(sourceId: string, targetId: string, link: LinkElement, type?: 0 | 1) {
        const parent = this.element(sourceId);
        if (type === undefined) type = !this._.son[parent.id][0] ? 0 : 1;
        this._.son[parent.id][type] = targetId;
        return super.__insertLink(sourceId, targetId, link);
    }
    __eraseLink(sourceId: string, targetId: string) {
        const node = this.element(sourceId);
        const type = this._.son[node.id][0] === targetId ? 0 : 1;
        this._.son[node.id][type] = undefined;
        return super.__eraseLink(sourceId, targetId);
    }
}
