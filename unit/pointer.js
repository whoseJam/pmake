import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).x(100).y(100).resize(10);
const tree = new sd.Tree(svg).x(500).y(100).root(1).link(1, 2).link(1, 3);

sd.init(() => {});

sd.main(async () => {
    const p = sd.Pointer(arr, "Pointer", "b");
    for (let i = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
    }
    await sd.pause();
    p.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    const pA = sd.Pointer(arr, "a", "t");
    const pB = sd.Pointer(arr, "b", "t");
    arr.startAnimate();
    pA.moveTo(1);
    pB.moveTo(1);
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    pB.moveTo(5);
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    pA.moveTo(8);
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    pB.moveTo(8);
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    pA.moveTo(tree.element(1));
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    pB.moveTo(tree.element(1));
    arr.endAnimate();
});
