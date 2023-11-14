import { SDHelper } from "../../Utility/SDHelper";
import { trim } from "../../Utility/Trim";

export function AbsD3Tree(self) {
    self.update = update;
    return self;
}

function update() {
    let hierarchy = SDHelper.treeHierarchy.call(this);
    if (hierarchy) {
        this._.height = hierarchy.height * this._.layerHeight;
        this.call("onHeight");
    }
    let info = SDHelper.treeInfo.call(this);
    if (!info) return this;
    
    let nodes = this._.nodes;
    let links = this._.links;
    info.descendants().forEach((node) => {
        let x = node.x + this.x();
        let y = node.y + this.y();
        let data = node.data.data;
        node = data.node;
        node.parent = null;
        node.cx(x).cy(y);
        node.parent = this;
    });
    info.links().forEach((link) => {
        let source = link.source;
        let target = link.target;
        let src = source.data.id;
        let tgt = target.data.id;
        if (!links[SDHelper.encode(src, tgt)]) return;
        link = links[SDHelper.encode(src, tgt)].link;
        link.parent = null;
        link.source(source.x + this.x(), source.y + this.y());
        link.target(target.x + this.x(), target.y + this.y());
        trim(link, nodes[src].node, nodes[tgt].node);
        link.parent = this;
    });
    this.isDirty = false;
    this.children.update();
    return this;
}