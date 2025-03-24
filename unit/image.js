import * as sd from "@/sd";

const svg = sd.svg();
const domain = "http://localhost:1313";
const img1 = new sd.Image(svg).href(domain + "/img/gift.png");
const img2 = new sd.Image(svg).href(domain + "/img/gift.png").x(50);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    img1.href(domain + "/img/snowflake.png");
    img2.startAnimate()
        .href(domain + "/img/snowflake.png")
        .endAnimate();
});
