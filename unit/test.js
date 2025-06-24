import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);

sd.init(() => {
    grid.n(7).m(7).elementWidth(50).elementHeight(50);
    grid.forEachElement((element, i, j) => {
        element.value(new sd.Box(svg)).color(C.white);
    });
    grid.element(0, 0).color(C.green).value(new sd.Text(svg, "1"));
    grid.element(3, 3).color(C.red).value(new sd.Text(svg, "0"));
    grid.element(2, 1).color(C.red).value(new sd.Text(svg, "0"));
    grid.element(1, 2).color(C.red).value(new sd.Text(svg, "0"));
    grid.element(4, 2).color(C.red).value(new sd.Text(svg, "0"));
    grid.element(2, 4).color(C.red).value(new sd.Text(svg, "0"));
});

sd.main(async () => {
    grid.forEachElement(async (element, i, j) => {
        if ((i === 0 && j === 0) || (i === 3 && j === 3) || (i === 2 && j === 1) || (i === 1 && j === 2) || (i === 4 && j === 2) || (i === 2 && j === 4)) return;
        await sd.pause();
        grid.element(i, j).startAnimate().color(C.blue).endAnimate();
        let left = i > 0 ? grid.element(i - 1, j).intValue() : 0;
        let top = j > 0 ? grid.element(i, j - 1).intValue() : 0;
        grid.element(i, j).value(new sd.Text(svg, left + top));
    });
});
