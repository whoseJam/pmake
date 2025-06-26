import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [3, -3, -2, 5, -4];
const array = new sd.Array(svg);

sd.init(() => {
    array.x(100).y(100);
    array.value(data);
});

sd.main(async () => {
    await sd.pause();
    const segments = [
        [0, 1],
        [3, 4],
    ];
    let totalLength = 0;
    for (const [start, end] of segments) {
        const brace = sd.Brace(array);
        brace.brace(start, end).color(C.blue);
        totalLength += end - start + 1;
    }
    const text = new sd.Text(svg);
    text.text(`Total Length: ${totalLength}`).x(200).y(200);
});
