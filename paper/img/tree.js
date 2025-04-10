import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg).width(150).x(100).y(100);
tree.link(1, 2, new sd.Image(svg).href("http://localhost:1313/img/gift.png").scale(0.5));
tree.newNode(3).newLink(1, 3, new sd.Image(svg).href("http://localhost:1313/img/snowflake.png").scale(0.5));

sd.init(() => {});

sd.main(async () => {});
