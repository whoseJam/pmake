import * as sd from "@/sd";

const svg = sd.svg();
const poly = new sd.Polygon(svg, [[100,100],[100,200],[200,100]]);

sd.init(() => {

})

sd.main(async () => {
    await sd.pause();
    poly.startAnimate().points([[200,300],[300,500],[100,500]]).endAnimate();
})