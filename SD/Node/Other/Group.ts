import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Group extends SDSVGNode {
    _: SDSVGNode["_"] & {
        nodes: Array<SDNode>;
    };
    constructor(nodes?: Array<SDNode>) {
        super();

        this._.renderer = this.__createSVGNode("g");

        this._.nodes = [];
        if (nodes) nodes.forEach(node => this.add(node));
    }

    append(child: SDNode | RenderNode) {
        if (child instanceof SDNode) {
            this.getRootRenderNode().append(child.getRootRenderNode());
            child._.parent = this;
        } else this.getRootRenderNode().append(child);
        return this;
    }

    appendChild(child: SDNode | RenderNode) {
        child._.parent = this;
        if (child instanceof SDNode) {
            this.getRootRenderNode().appendChild(child.getRootRenderNode());
            child._.parent = this;
        } else this.getRootRenderNode().appendChild(child);
        return this;
    }

    insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
        if (child instanceof SDNode) child._.parent = this;
        const child_ = child instanceof SDNode ? child.getRootRenderNode() : child;
        const referenced_ = referenced instanceof SDNode ? referenced.getRootRenderNode() : referenced;
        this.getRootRenderNode().insertBefore(child_, referenced_);
        return this;
    }

    getX() {
        let x = this._.nodes[0].getX();
        for (let i = 1; i < this._.nodes.length; i++) x = Math.min(x, this._.nodes[i].getX());
        return x;
    }

    getY() {
        let y = this._.nodes[0].getY();
        for (let i = 1; i < this._.nodes.length; i++) y = Math.min(y, this._.nodes[i].getY());
        return y;
    }

    getMaxX() {
        let mx = this._.nodes[0].getMaxX();
        for (let i = 1; i < this._.nodes.length; i++) mx = Math.max(mx, this._.nodes[i].getMaxX());
        return mx;
    }

    getMaxY() {
        let my = this._.nodes[0].getMaxY();
        for (let i = 1; i < this._.nodes.length; i++) my = Math.max(my, this._.nodes[i].getMaxY());
        return my;
    }

    getWidth() {
        return this.getMaxX() - this.getX();
    }

    getHeight() {
        return this.getMaxY() - this.getY();
    }

    add(node: SDNode) {
        this.appendChild(node);
        this._.nodes.push(node);
        return this;
    }

    erase(node: SDNode) {
        const id = this._.nodes.indexOf(node);
        if (id === -1) return this;
        node.remove();
        this._.nodes.splice(id, 1);
        return this;
    }

    startAnimate() {
        super.startAnimate.apply(this, arguments);
        if (arguments.length !== 3) return this;
        for (const node of this._.nodes) node.startAnimate.apply(node, arguments);
        return this;
    }
    endAnimate() {
        super.endAnimate.apply(this, arguments);
        for (const node of this._.nodes) node.endAnimate.apply(node, arguments);
        return this;
    }
    after() {
        super.after.apply(this, arguments);
        for (const node of this._.nodes) node.after.apply(node, arguments);
        return this;
    }
}
