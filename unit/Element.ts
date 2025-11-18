import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestCenterLayout);

async function TestCenterLayout() {
    const creators = [sd.Box, sd.Vertex, sd.EllipseVertex];
    const nodes = [];
    for (let i = 0; i < creators.length; i++) {
        const node = new creators[i](svg);
        node.x(100 + i * 100).y(100);
        // .width(60)
        // .height(60);
        nodes.push(node);
    }
    await sd.pause();
    for (let i = 0; i < nodes.length; i++) {
        console.log(nodes[i].value);
        nodes[i].startAnimate();
        nodes[i].value("Hello");
        nodes[i].endAnimate();
    }
    await sd.pause();
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].startAnimate().value("W").endAnimate();
    }
}
