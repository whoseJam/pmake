import * as sd from "@/sd";

const C = sd.color();
const div = sd.div();
const canvas = new sd.Canvas(div).three();
const rect = new sd.Rect3D(canvas);
const light = new sd.AmbientLight(canvas);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    light.startAnimate().color(C.grey).endAnimate();
    await sd.pause();
    light.startAnimate().intensity(10).endAnimate();
});
