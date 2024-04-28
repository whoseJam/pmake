import { SDHelper } from "../../Utility/SDHelper";
import { trim } from "../../Utility/Trim";
import { Tree } from "./Tree";

export class HorizontalTree extends Tree {
    constructor(node) {
        super(node);
        this.g().attr("type", "HorizontalTree")
        this._.width = 0;
        this._.height = 300;
        this._.layerWidth = 60;
        delete this._["layerHeight"];
    }

    layerWidth(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.layerWidth;
        this._.layerWidth = width;
        this.dirty();
        return this;
    }

    update() {
        const hierarchy = SDHelper.treeHierarchy.call(this);
        if (hierarchy) this._.width = hierarchy.height * this._.layerWidth;
        const info = SDHelper.treeInfo(hierarchy, this._.height, this._.width);
        if (!info) return this;
        const toHorizontal = (x0, y0) => {
            x0 = x0 + this.x();
            y0 = y0 + this.y();
            return [y0 - this.y() + this.x(), x0 - this.x() + this.y()];
        }
        info.descendants().forEach(node => {
            const at = toHorizontal(node.x, node.y);
            node = node.data.data;
            const move = () => { node.cx(at[0]).cy(at[1]); }
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        });
        info.links().forEach(link => {
            const source = link.source;
            const target = link.target;
            const src = source.data.id;
            const tgt = target.data.id;
            link = this.findLinkById(src, tgt);
            if (!link) return;
            const move = () => {
                link.source(toHorizontal(source.x, source.y));
                link.target(toHorizontal(target.x, target.y));
                trim(link, this.findNodeById(src), this.findNodeById(tgt));    
            }
            if (link._.enterFlag) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else move();
        });
        this.children.update();
        return this;
    }
}