import { Line } from "../Basic/Line";
import { BinaryTree } from "./BinaryTree";
import { trim } from "../../Utility/Trim";

export class Splay extends BinaryTree {
    constructor(node) {
        super(node);
        this.g().type("Splay");
        this._.r = 20;
        this._.width = 300;
        this._.height = 0;
        this._.layerHeight = 60;
        this._.makeLink = function(node) {
            return new Line(node);
        }
    }

    record(flag = true) {
        if (!flag) { this._.record = false; return this; }
        const root = this.stratify();
        const sequence = [];
        const dfs = (u) => {
            u.children.sort((a, b) => {
                return a.dir - b.dir;
            });
            console.assert(u.children.length <= 2);
            let lc = u.children.find(child => child.data.dir === 0);
            let rc = u.children.find(child => child.data.dir === 1);
            if (lc) dfs(lc);
            sequence.push(u);
            if (rc) dfs(rc);
        }
        dfs(root);
        for (let [idx, u] of sequence.entries()) {
            u.data._.recordDepth = u.depth;
            u.data._.recordIdx = idx;
        }
        this._.record = true;
    }

    update() {
        this.preUpdate();
        const root = this.stratify();
        if (!root) return this;
        const maxY = this._.y;
        const sequence = [];
        const realX = (rank, gap) => this.x() + (rank + 1) * gap;
        const realY = (depth) => this.y() + this.layerHeight() * depth;
        const dfs = (u) => {
            u.children.sort((a, b) => {
                return a.dir - b.dir;
            });
            console.assert(u.children.length <= 2);
            let lc = u.children.find(child => child.data.dir === 0);
            let rc = u.children.find(child => child.data.dir === 1);
            if (lc) dfs(lc);
            sequence.push(u);
            if (rc) dfs(rc);
        }
        if (!this._.record) dfs(root);
        else {
            const nodes = this._.nodes;
            for (let node of nodes) {
                sequence.push({
                    depth: node._.recordDepth,
                    idx: node._.recordIdx,
                    data: node
                });
            }
            sequence.sort((a, b) => a.idx - b.idx);
            console.log("splay update by record this.L=", this._.animateL, "this.R=", this._.animateR);
        }
        const gap = this._.width / (sequence.length + 1);
        for (let [idx, u] of sequence.entries()) {
            const x = realX(idx, gap);
            const y = realY(u.depth);
            const node = u.data;
            const move = () => node.cx(x).cy(y);
            if (node._.enter) {
                node._.enter(node, move);
                node._.enter = undefined;
            } else move();
        }
        const links = this._.links;
        for (let link of links) {
            const src = this.findNodeById(link.parentNodeId);
            const tgt = this.findNodeById(link.childNodeId);
            const move = () => {
                link.source(src.cx(), src.cy());
                link.target(tgt.cx(), tgt.cy());
                trim(link, src, tgt);
            };
            if (link._.enter) {
                link._.enter(link, move);
                link._.enter = undefined;
            } else move();
        }
        this._.height = maxY - this._.y;
        this.postUpdate();
        return this;
    }
}