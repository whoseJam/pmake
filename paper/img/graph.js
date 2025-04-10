import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const dag = new sd.DAG(svg).x(100).y(100).width(60).height(60);
dag.newNode(1, new sd.Rect(svg).color(C.orange));
dag.newNode(2, new sd.Circle(svg).color(C.blue));
dag.newNode(3, new sd.Image(svg).href("http://localhost:1313/img/gift.png"));
dag.link(1, 2).link(1, 3).link(2, 3);

sd.init(() => {});

sd.main(async () => {});
