import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

sd.init(() => {});

sd.main(TestValueCoveredByBackgroundError);

async function TestValueCoveredByBackgroundError() {
    const vertex = new sd.Vertex(svg, new sd.Mathjax(svg, "wtf"));
}

async function TestSvgElementWithDiv() {
    const box = new sd.Box(svg).x(100).y(100).width(70).height(30);
    box.value(new sd.Button(div));
    await sd.pause();
    box.startAnimate().opacity(0.5).endAnimate();
}

async function TestDiffElement() {
    const elementTypes = [sd.Vertex, sd.Box, sd.EllipseVertex];
    const elements = [];

    for (let i = 0; i < elementTypes.length; i++) {
        const element = new elementTypes[i](svg);
        element.cx(i * 100 + 100).cy(100);
        elements.push(element);
    }

    await sd.pause();
    for (let i = 0; i < elements.length; i++) {
        elements[i].startAnimate().width(60).endAnimate();
    }

    await sd.pause();
    const rands = [];
    for (let i = 0; i <= 10; i++) {
        const a = new sd.Text(svg, i).cx(sd.rand(100, 1100)).cy(sd.rand(100, 500));
        rands.push(a);
    }

    await sd.pause();
    for (let i = 0; i <= 10; i++) {
        elements[i % elements.length].startAnimate().valueFromExist(rands[i]).endAnimate();
    }

    await sd.pause();
    for (let i = 0; i <= 10; i++) {
        elements[i % elements.length].startAnimate().value(i).endAnimate();
    }
}
