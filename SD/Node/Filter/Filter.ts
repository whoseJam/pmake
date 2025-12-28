import { SDSVGNode } from "@/Node/SDSVGNode";
import { NumberOrPercent, SDNode } from "@/Node/SDNode";
import { Group } from "@/Node/Other/Group";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDString, URLString } from "@/Utility/String";

export type SDFilter = Filter | string | URLString;

export class Filter extends SDSVGNode {
    constructor(args?: {
        targetNode?: Group;
        id?: string;
        x?: NumberOrPercent;
        y?: NumberOrPercent;
        width?: NumberOrPercent;
        height?: NumberOrPercent;
    }) {
        super();

        this._.renderer = this.createSVGNode("filter", {
            id: args?.id ?? "",
            x: args?.x ?? "0%",
            y: args?.y ?? "0%",
            width: args?.width ?? "100%",
            height: args?.height ?? "100%",
        });

        args?.targetNode?.append(this);
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

    getId() {
        return this._.id;
    }

    getX() {
        return this._.x;
    }

    setX(x: NumberOrPercent) {
        return this.triggerAttributeChanged(this._.renderer, "x", x, this._.x);
    }

    getY() {
        return this._.y;
    }

    setY(y: NumberOrPercent) {
        return this.triggerAttributeChanged(this._.renderer, "y", y, this._.y);
    }

    getWidth() {
        return this._.width;
    }

    setWidth(width: NumberOrPercent) {
        return this.triggerAttributeChanged(this._.renderer, "width", width, this._.width);
    }

    getHeight() {
        return this._.height;
    }

    setHeight(height: NumberOrPercent) {
        return this.triggerAttributeChanged(this._.renderer, "height", height, this._.height);
    }

    static toURLString(filter: SDFilter) {
        if (filter === undefined) return undefined;
        if (filter instanceof Filter) return `url(#${filter.getId()})`;
        return SDString.toURLString(filter);
    }
}
