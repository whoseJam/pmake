import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const array = new sd.Array(svg);
array.pushArray([5, -2, -4, -6, 2, 3, -6, 5, 3, -2]);

sd.init(() => {
    array.x(100).y(100);
});

sd.main(async () => {
    await sd.pause();
    const segments = [[0, 8]];
    let totalLength = 0;
    for (const [start, end] of segments) {
        const brace = new sd.Brace(array);
        brace.brace(start, end).color(C.blue);
        for (let i = start; i <= end; i++) {
            array.startAnimate().color(i, C.blue).endAnimate();
        }
        totalLength += end - start + 1;
    }
    const text = new sd.Text(svg);
    text.text(`Total Length: ${totalLength}`)
        .cx(svg.width() / 2)
        .y(200);
});
