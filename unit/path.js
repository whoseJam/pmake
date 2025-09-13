import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestPathTransform);

async function TestPathTransform() {
    const str1 = "M 50 200 L 50 350 A 20 20 0 0 1 70 370 L 330 370 A 20 20 0 0 1 350 350 L 350 150 A 50 30 10 1 0 250 100 Q 180 80 150 120 T 90 140 C 70 160 60 130 70 120 L 70 200 A 15 15 0 0 0 50 200 Z";
    const str2 = "M 50 200 L 100 300 Z";
    const path = new sd.Path(svg).d(str1);
    await sd.pause();
    path.startAnimate().d(str2).endAnimate();
}

async function TestPathEngineToCubics() {
    const PathEngine = sd.PathEngine;
    const str1 = "M 50 200 L 50 350 A 20 20 0 0 1 70 370 L 330 370 A 20 20 0 0 1 350 350 L 350 150 A 50 30 10 1 0 250 100 Q 180 80 150 120 T 90 140 C 70 160 60 130 70 120 L 70 200 A 15 15 0 0 0 50 200 Z";
    const str2 = "M 50 200 L 100 300 Z";
    const path1 = new sd.Path(svg).d(str1);
    const path2 = new sd.Path(svg).d(str2);
    const [d1, d2] = PathEngine.toCubics(PathEngine.toOpers(str1), str2);
    const path1Stroke = new sd.Path(svg).d(d1).dy(2).stroke(C.textBlue);
    const path2Stroke = new sd.Path(svg).d(d2).dy(2).stroke(C.red);
}

async function TestPathEngineToCubic() {
    const PathEngine = sd.PathEngine;
    const str = "M 50 200 L 50 350 A 20 20 0 0 1 70 370 L 330 370 A 20 20 0 0 1 350 350 L 350 150 A 50 30 10 1 0 250 100 Q 180 80 150 120 T 90 140 C 70 160 60 130 70 120 L 70 200 A 15 15 0 0 0 50 200 Z";
    const path1 = new sd.Path(svg).d(str);
    const path2 = new sd.Path(svg)
        .d(PathEngine.toString(PathEngine.toCubic(PathEngine.toOpers(path1.d()))))
        .dy(2)
        .stroke(C.textBlue);
}

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
