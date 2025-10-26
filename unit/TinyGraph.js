import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestLink);

async function TestLink() {
    const graph = new sd.TinyGraph(svg).cx(600).y(100);
    await sd.pause();
    graph.startAnimate().freeze().newNode(1).newNode(2).unfreeze().endAnimate();
    await sd.pause();
    graph.startAnimate().link(1, 2).endAnimate();
    await sd.pause();
    graph.startAnimate().newNode(3).link(1, 3).endAnimate();
}
