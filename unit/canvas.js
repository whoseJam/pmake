import * as sd from "@/sd";

const div = sd.div();
const C = sd.color();
const canvas = new sd.Canvas(div).width(1000).height(600);
const three = canvas.three();
const camera = three.camera();
const cube = new sd.Cube(three);
const light = new sd.Light(three);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    camera.startAnimate().x(6).endAnimate();
});
