import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestValueAndBrace);

async function TestValueAndBrace() {
    const arr = new sd.Array(svg).resize(10).x(100).y(100);
    const brace = sd.Brace(arr, "t");
    await sd.pause();
    brace.value("hello").startAnimate().brace(1, 3).endAnimate();
}

async function TestMathValue() {
    const arr = new sd.Array(svg).resize(10).x(100).y(100);
    const brace = sd.Brace(arr, "t");
    await sd.pause();
    brace.startAnimate().brace(1, 3).value("$a^2+b^2$").endAnimate();
}

async function TestBasic() {
    const arr = new sd.Array(svg).resize(10).x(100).y(100);
    const stk = new sd.Stack(svg).resize(10).x(800).y(100);
    const grid = new sd.Grid(svg).n(3).m(5).x(100).y(200);
    const brace1 = sd.Brace(arr);
    await sd.pause();
    brace1.startAnimate().brace(1, 3).endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(2, 4).endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(3, 6, "b").endAnimate();
    await sd.pause();
    brace1.startAnimate().value("hello").endAnimate();
    await sd.pause();
    brace1.value().startAnimate().width(100).endAnimate();
    await sd.pause();
    brace1.startAnimate().brace(3, 7).endAnimate();
    await sd.pause();
    brace1.startAnimate().valueGap(20).endAnimate();

    const brace2 = sd.Brace(stk);
    await sd.pause();
    brace2.startAnimate().brace(1, 3, "l").endAnimate();
    await sd.pause();
    brace2.startAnimate().brace(2, 4).endAnimate();
    await sd.pause();
    brace2.startAnimate().brace(3, 6, "r").endAnimate();
    await sd.pause();
    brace2.startAnimate().value("world").endAnimate();
    await sd.pause();
    brace2.startAnimate().braceGap(30).endAnimate();

    const v1 = new sd.Vertex(svg).center([400, 300]);
    const v2 = new sd.Vertex(svg).center([500, 400]);
    await sd.pause();
    const brace3 = sd.Brace(svg);
    brace3.startAnimate().brace(v1, v2, "r").endAnimate();
    await sd.pause();
    v2.startAnimate().dx(-100).endAnimate();
    await sd.pause();
    v1.startAnimate().dx(100).dy(50).endAnimate();
    await sd.pause();
    v1.startAnimate().dx(-100).endAnimate();
    v2.startAnimate().dx(100).endAnimate();
}
