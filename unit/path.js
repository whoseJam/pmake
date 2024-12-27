import * as sd from "@/sd";

const svg = sd.svg();
const pen = new sd.PathPen();
const path = new sd.Path(svg);

sd.init(() => {
    const str = pen.MoveTo(100, 100).LinkTo(150, 150).LinkTo(100, 200).toString();
    console.log("str=", str);
    path.d(str);
})

sd.main(async () => {
    await sd.pause();
    path.startAnimate().pointStoT().endAnimate().arrow();
})