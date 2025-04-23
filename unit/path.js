import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const pen = new sd.PathPen();
    const path = new sd.Path(svg);
    const str = pen.MoveTo(100, 100).LinkTo(150, 150).LinkTo(100, 200).toString();
    path.d(str);
    await sd.pause();
    path.startAnimate().x(200).endAnimate();
    await sd.pause();
    path.startAnimate().y(200).endAnimate();
    await sd.pause();
    path.startAnimate().width(300).endAnimate();
    await sd.pause();
    path.startAnimate().x(100).y(100).width(40).height(40).endAnimate();
}
