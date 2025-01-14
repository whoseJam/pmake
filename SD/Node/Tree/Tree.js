import { Vector as V } from "@/Math/Vector";
import { Enter as EN } from "@/Node/Core/Enter";
import { effect } from "@/Node/Core/Reactive";
import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Nake/Line";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { hierarchy, stratify, tree } from "d3";

export function Tree(parent) {
    BaseTree.call(this, parent);

    this.type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = Line;

    this.vars.merge({
        r: 20,
        width: 300,
        height: 0,
        layerHeight: 60,
    });

    this._.updater = effect(() => {
        const r = this.vars.r;
        D3Layout.call(
            this,
            "vertical",
            node => [node.x + this.x(), node.y + this.y()],
            (node, limit) => node.r(Math.min(r, limit / 2.1))
        );
    });
}

Tree.prototype = {
    ...BaseTree.prototype,
};

Tree.prototype.width = Factory.handlerLowPrecise("width");
Tree.prototype.r = Factory.handlerLowPrecise("r");
Tree.prototype.layerHeight = Factory.handlerLowPrecise("layerHeight");
Tree.prototype.height = function (height) {
    if (height === undefined) return this.vars.height;
    const depth = this.depth();
    if (!depth) return this;
    this.layerHeight(height / depth);
    return this;
};

Tree.prototype.newNode = function (id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
};

Tree.prototype.newNodeFromExistValue = function (id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    element.value(value.onEnter(EN.moveTo()));
    return this;
};

Tree.prototype.newNodeFromExistElement = function (id, value) {
    const element = value;
    element.onEnter(EN.moveTo("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
};

Tree.prototype.newLink = function (x, y, value = null) {
    const element = new this._.linkType(this.layer("links"));
    if (value !== null) element.value(value);
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseTree(x, y, element);
    return this;
};

Tree.prototype.newLinkFromExistValue = function (sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    element.value(value.onEnter(EN.moveTo()));
    return this;
};

Tree.prototype.newLinkFromExistElement = function (sourceId, targetId, value) {
    const element = value;
    element.onEnter(EN.moveTo("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    return this;
};

export function D3Layout(mode, convert, size) {
    let data, root, layout, result;
    try {
        const template = stratify();
        template.id(d => this.nodeId(d));
        template.parentId(d => {
            const father = this.father(d);
            return father ? this.nodeId(father) : undefined;
        });
        data = template(this.vars.nodes);
    } catch (e) {
        return;
    }
    root = hierarchy(data);

    if (mode === "vertical") {
        this.vars.height = root.height * this.layerHeight();
        layout = tree().size([this.width(), this.height()]);
    } else {
        this.vars.width = root.height * this.layerWidth();
        layout = tree().size([this.height(), this.width()]);
    }
    result = layout(root);

    let limit = Infinity;
    const nodes = result.descendants();
    const nodesMap = new Map();
    nodes.forEach((node, i) => {
        const vec = convert(node);
        nodesMap.set(node.data.data, node);
        for (let j = i + 1; j < nodes.length; j++) {
            limit = Math.min(limit, V.length(V.sub(vec, convert(nodes[j]))));
        }
    });

    this.forEachNode((node, id) => {
        const layout = nodesMap.get(node);
        this.tryUpdate(node, () => {
            size(node, limit);
            node.center(convert(layout));
        });
    });
    this.forEachLink((link, sourceId, targetId) => {
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryUpdate(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}
