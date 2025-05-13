import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const domain = "http://localhost:1313";

sd.init(() => {});

sd.main(TestImageSVGAndHTML);

async function TestImageSVGAndHTML() {
    const i1 = new sd.ImageHTML(div)
        .href(domain + "/img/gift.png")
        .x(100)
        .y(100);
    const i2 = new sd.Image(svg)
        .href(domain + "/img/gift.png")
        .x(200)
        .y(100);
    await sd.pause();
    i1.startAnimate().width(80).endAnimate();
    i2.startAnimate().width(80).endAnimate();
}

async function TestScale() {
    const tree = new sd.Tree(svg);
    tree.link(1, 2, new sd.Image(svg).href(domain + "/img/gift.png").scale(0.5));
    tree.newNode(3).newLink(1, 3, new sd.Image(svg).href(domain + "/img/snowflake.png"));
}

async function TestBasic() {
    const img1 = new sd.Image(svg).href(domain + "/img/gift.png");
    const img2 = new sd.Image(svg).href(domain + "/img/gift.png").x(50);
    await sd.pause();
    img1.href(domain + "/img/snowflake.png");
    img2.startAnimate()
        .href(domain + "/img/snowflake.png")
        .endAnimate();
}
