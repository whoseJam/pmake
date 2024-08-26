import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).dy(22).width(400);
const n = 11;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [4, 8],
    [4, 9],
    [7, 10],
    [7, 11]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).arrow();
    });
    for (let i = 1; i <= n; i++) {
        const node = tree.element(i);
        node.onClick(() => {
            node.onClick(() => {});
            let cnt = 0;
            links.forEach(link => {
                if (link[0] === i) {
                    cnt++;
                }
            });
            node.color(cnt ? C.green : C.orange);
        })
    }
});

sd.main(() => {
});