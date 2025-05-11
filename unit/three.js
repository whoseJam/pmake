import * as sd from "@/sd";

const C = sd.color();
const div = sd.div();
const canvas = new sd.Canvas(div).three();
const camera = canvas.camera();
// const rect = new sd.Rect3D(canvas);
const cube = new sd.Cube(canvas);
const light = new sd.AmbientLight(canvas);
console.log(camera._.camera);

canvas.canvas().nake().style["border"] = "1px solid black";

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    camera.startAnimate().direction(0, -0.5, -1).endAnimate();
    await sd.pause();
    camera.startAnimate().position(5, 5, 5).endAnimate();
    await sd.pause();
    camera.startAnimate().direction(-5, -5, -5).endAnimate();
    // camera.startAnimate().left(-3).endAnimate();
    // await sd.pause();
    // light.startAnimate().color(C.grey).endAnimate();
    // await sd.pause();
    // light.startAnimate().intensity(10).endAnimate();
});
