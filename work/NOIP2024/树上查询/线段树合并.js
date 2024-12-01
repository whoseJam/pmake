import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).layerHeight(90).width(600);
const n = 6;
const links = [
    [1, 6],
    [6, 5],
    [6, 2],
    [2, 3],
    [2, 4]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        tree.element(i).childAs("seg", new sd.Array(svg).elementWidth(15).elementHeight(15).resize(n).start(1).color(i, C.purple), R.aside("tc", 3));
    }
})

sd.main(async () => {
    await Dfs(1);
})

async function Dfs(u) {
    const children = tree.children(u);
    for (let i = 0; i < children.length; i++) {
        await Dfs(tree.nodeId(children[i]));
        const self = tree.element(u).child("seg");
        const other = children[i].child("seg");
        
        await sd.pause();
        const l = sd.Link(other, self, sd.Line, "cx", "y", "cx", "my").stroke(C.textBlue).startAnimate().pointStoT().endAnimate().arrow();

        await sd.pause();
        self.startAnimate();
        for (let j = 1; j <= n; j++) {
            if (other.color(j).main === C.purple) {
                self.color(j, C.darkPurple);
            }
        }
        self.endAnimate();
        await sd.pause();
        const braces = [];
        for (let l = 1, r; l <= n; l = r + 1) {
            r = l;
            while (r + 1 <= n && self.color(l).main === self.color(r + 1).main) r++;
            if (self.color(l).main === C.white) continue;
            if ((r + 1 > n || self.color(r + 1).main === C.white) &&
                (l - 1 < 1 || self.color(l - 1).main === C.white)) continue;
            braces.push(sd.Brace(self).startAnimate().brace(l, r).endAnimate());
        }
        await sd.pause();
        self.startAnimate();
        for (let j = 1; j <= n; j++) {
            if (self.color(j).main === C.darkPurple) {
                self.color(j, C.purple);
            }
        }
        self.endAnimate();

        await sd.pause();
        braces.forEach(brace => brace.startAnimate().opacity(0).endAnimate().remove());
        l.startAnimate().fadeStoT().endAnimate().arrow(null).remove();
    }
}
