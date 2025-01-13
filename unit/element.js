import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const elementTypes = [sd.Vertex, sd.Box, sd.EllipseVertex];
const elements = [];

sd.init(() => {
    for (let i = 0; i < elementTypes.length; i++) {
        const element = new elementTypes[i](svg);
        element.cx(i * 100 + 100).cy(100);
        elements.push(element);
    }
});

sd.main(async () => {
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
});
