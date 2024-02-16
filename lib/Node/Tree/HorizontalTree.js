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
        if (width === undefined)
            return this._.layerWidth;
        this._.layerWidth = width;
        this.update();
        return this;
    }

    update() {
        let hierarchy = SDHelper.treeHierarchy.call(this);
        if (hierarchy) this._.width = hierarchy.height * this._.layerWidth;
        let info = SDHelper.treeInfo(hierarchy, this._.height, this._.width);
        if (!info) return this;
        let thisx = this.x(), thisy = this.y();
        function toHorizontal(x0, y0) {
            x0 = x0 + thisx;
            y0 = y0 + thisy;
            return [y0 - thisy + thisx, x0 - thisx + thisy];
        }
        info.descendants().forEach((node) => {
            let x0 = node.x + this.x();
            let y0 = node.y + this.y();
            let x1 = y0 - this.y() + this.x();
            let y1 = x0 - this.x() + this.y();
            node = node.data.data;
            node.parent = null;
            node.cx(x1).cy(y1);
            node.parent = this;
        });
        info.links().forEach((link) => {
            let source = link.source;
            let target = link.target;
            let src = source.data.id;
            let tgt = target.data.id;
            link = this.findLinkById(src, tgt);
            if (!link) return;
            link.parent = null;
            link.source(toHorizontal(source.x, source.y));
            link.target(toHorizontal(target.x, target.y));
            trim(link, this.findNodeById(src), this.findNodeById(tgt));
            link.parent = this;
        });
        this.children.update();
        return this;
    }

    /**
     * 用户不应该调用此方法
     * @param {string|number} id 
     * @param {Node|undefined} elem 
     * @returns 当前节点
     */
    newNodeByTreeBase(id, elem) {
        super.newNodeByTreeBase(id, elem);
        return this;
    }
}