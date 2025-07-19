import * as sd from "@/sd";

export class TreeGraph extends sd.Tree {
    constructor(target, n, links, externLinks) {
        super(target);
        this.width(500);
        for (let i = 1; i <= n; i++) this.newNode(i);
        this._.externLinks = [];
        links.forEach(([x, y]) => {
            this.newLink(x, y);
            this.element(x, y);
        });
        externLinks.forEach(link => {
            const [x, y, clazz] = [link[0], link[1], link[2]];
            const line = sd.Link(this.element(x), this.element(y), clazz);
            line.id0 = x;
            line.id1 = y;
            this._.externLinks.push(line);
        });
    }
    outLinksAndNodes(u) {
        const links = [];
        const nodes = [];
        this.children(u).forEach(node => {
            nodes.push(node);
            links.push(this.element(u, node));
            this.element(u, node).reversed = false;
        });
        const fa = this.father(u);
        if (fa) {
            nodes.push(fa);
            links.push(this.element(fa, u));
            this.element(fa, u).reversed = true;
        }
        this._.externLinks.forEach(link => {
            if (String(link.id0) === String(u)) {
                link.reversed = false;
                nodes.push(this.element(link.id1));
                links.push(link);
            }
            if (String(link.id1) === String(u)) {
                link.reversed = true;
                nodes.push(this.element(link.id0));
                links.push(link);
            }
        });
        return [links, nodes];
    }
}
