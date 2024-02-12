import { TreeBase } from "./TreeBase";
import { trim } from "../../Utility/Trim";
import { Vertex } from "../Element/Vertex";
import { Text } from "../Basic/Text";
import { Line } from "../Basic/Line";
import { SDHelper } from "../../Utility/SDHelper";

export class Tree extends TreeBase {
    constructor(node) {
        super(node)
        this.g().attr("Tree", "");
        this._.r = 20;
        this._.width = 300;
        this._.height = 0;
        this._.layerHeight = 60;
        this._.makeLink = function(node) {
            return new Line(node);
        };
    }

    layerHeight(height) {
        if (height === undefined)
            return this._.layerHeight;
        this._.layerHeight = height;
        this.update();
        return this;
    }

    update() {
        let hierarchy = SDHelper.treeHierarchy.call(this);
        if (hierarchy) this._.height = hierarchy.height * this._.layerHeight;
        let info = SDHelper.treeInfo.call(this);
        if (!info) return this;
        
        let nodes = this._.nodes;
        info.descendants().forEach((node) => {
            let x = node.x + this.x();
            let y = node.y + this.y();
            node = node.data.data;
            node.parent = null;
            node.cx(x).cy(y);
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
            link.source(source.x + this.x(), source.y + this.y());
            link.target(target.x + this.x(), target.y + this.y());
            trim(link, this.findNodeById(src), this.findNodeById(tgt));
            link.parent = this;
        });
        super.update();
        return this;
    }

    /**
     * 新建一个编号为id，价值为value的节点，如果价值未指定，则默认为id，随后交由TreeBase完成信息的存储工作和update的工作
     * @param {string|number} id 
     * @param {Node|undefined} value
     * @returns 当前节点
     */
    newNode(id, value = null) {
        let elem = new Vertex(this);
        if (value === null) elem.value(new Text(this, id));
        else elem.value(value);
        super.newNode(id, elem);
        return this;
    }

    /**
     * 新建一条从x指向y的，价值为value的边，其中x是父节点，y是子节点，随后交由TreeBase完成信息的存储工作和update的工作
     * @param {string|number} x 
     * @param {string|number} y 
     * @param {Node|undefined} value 
     * @returns 当前节点
     */
    newLink(x, y, value = null) {
        let elem = this._.makeLink(this);
        if (value !== null) elem.value(value);
        super.newLink(x, y, elem);
        return this;
    }
}