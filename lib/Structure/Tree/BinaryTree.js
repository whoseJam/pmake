import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node_";
import { Interact } from "../../Interact/Interact";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsElemTree } from "./AbsElemTree";
import { trim } from "../../Utility/Trim";
import { SDHelper } from "../../Utility/SDHelper";

export function BinaryTree(node) {
    let self = {};
    self = Node(self, node, "BinaryTree");
    self = AbsTree(self);
    self = AbsElemTree(self);
    self = AbsVerticalTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self.extNewNode = extNewNode;
    self.extNewLink = extNewLink;
    self.update = update;
    self.link = link;
    self.width(300);
    self.layerHeight(60);
    self.r(20);
    self.nodeWidth(40);
    self.nodeHeight(40);
    return self;
}

function link(x, y, what) {
    let newRoot = (this.root() === y);
    if (this._.nodes[y] === undefined) this.newNode(y);
    if (this._.nodes[x] === undefined) this.newNode(x);
    if (newRoot) {
        this._.nodes[x].preIn();
        this._.nodes[x].parent = "";
    }
    if (arguments.length === 3) this.newLink(x, y, null, what);
    else this.newLink.apply(this, arguments);    
    if (newRoot) {
        this._.nodes[x].in();
        this._.nodes[x].preIn = SDHelper.emptyFunc;
        this._.nodes[x].in = SDHelper.emptyFunc;
    }
    return this;
}

function extNewNode(node, args) {
    if (node.r) {
        node.r(this.r());
    } else {
        node.width(this.nodeWidth());
        node.height(this.nodeHeight());
    }
}

function left(u) {
    for (let id in this._.links) {
        let link = this._.links[id];
        if (link.parent === u) {
            if (this._.nodes[link.id].dir === 0)
                return link.id;
        }
    }
    return null;
}

function right(u) {
    for (let id in this._.links) {
        let link = this._.links[id];
        if (link.parent === u) {
            if (this._.nodes[link.id].dir === 1)
                return link.id;
        }
    }
    return null;
}

function extNewLink(link, args) {
    if (args.length < 3) throw new Error("invalid arguments");
    let dir = (args.length === 3) ? args[2] : args[3];
    if (dir !== 0 && dir !== 1) throw new Error("invalid arguments");
    let x = args[0], y = args[1];
    this._.nodes[y].dir = dir;
}

function update() {
    let root = this.stratify();
    if (!root) return this;
    console.log("update root=", root);
    let self = this;
    let maxY = this._.y;
    function dfs(u, rank, gap) {
        u.children.sort(function(a, b) {
            return a.dir - b.dir;
        });
        let x = self._.x + (rank * 2 + 1) * gap;
        let y = self._.y + self._.layerHeight * u.depth;
        maxY = Math.max(maxY, y);
        let node = u.data.node;
        node.cx(x).cy(y);
        for (let i = 0; i < u.children.length; i++) {
            let v = u.children[i];
            dfs(v, rank * 2 + v.data.dir, gap / 2);
        }
    }
    dfs(root, 0, this._.width / 2);
    for (let id in this._.links) {
        let link = this._.links[id];
        let elem = link.link;
        let src = this._.nodes[link.parent].node;
        let tgt = this._.nodes[link.id].node;
        elem.source(src.cx(), src.cy());
        elem.target(tgt.cx(), tgt.cy());
        trim(elem, src, tgt);
    }
    this._.height = maxY - this._.y;
    this.call("onHeight");
    this.isDirty = false;
    this.children.update();
    return this;
}