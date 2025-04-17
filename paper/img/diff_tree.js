import * as sd from "@/sd";

const svg = sd.svg();
const t1 = new sd.Tree(svg).link(1, 2).link(1, 3).link(2, 4).link(2, 5).width(250);
const t2 = new sd.BinaryTree(svg).root(1).link(1, 2).link(1, 3).link(2, 4).link(2, 5);
const t3 = new sd.HorizontalTree(svg).link(1, 2).link(1, 3).link(2, 4).link(2, 5);
const t4 = new sd.Splay(svg).root(1).link(1, 2).link(1, 3).leftChild(2, 4).leftChild(3, 5);

t1.x(100).y(100);
t2.x(t1.mx() - 40).y(100);
t3.x(t2.mx()).cy(160);
t4.x(t3.mx() + 20).y(100);

console.log("t4.height=", t4.height(), "t4.y=", t4.y());

sd.init(() => {});

sd.main(async () => {});
