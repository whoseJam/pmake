import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.FixGapCoord(svg).gap("x", 50).gap("y", 50).ticks("x", [-2, 6, 1]).ticks("y", [-2, 2, 1]);
const path = new sd.Path(svg).arrow().stroke(C.textBlue);
const arr = new sd.Array(svg).start(1);
const pen = new sd.PathPen();
const data = [
    [-1, 1],
    [2, -1],
    [3, 0],
    [0, 1],
    [2, 0],
    [1, 0],
];

sd.init(() => {
    const start = new sd.Circle(svg).r(3).center(coord.global(0, 0));
    sd.Label(start, "s", "bc", 20, 0);
    pen.MoveTo(coord.global(0, 0));
    path.d(pen.toString());
    data.forEach((point, i) => {
        const circle = new sd.Vertex(coord, i + 1).r(15).center(coord.global(point));
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().color(C.blue).endAnimate();
                arr.startAnimate()
                    .push(i + 1)
                    .endAnimate();
                pen.LinkTo(coord.global(point));
                path.startAnimate().d(pen.toString()).endAnimate();
            });
            circle.onClick(null);
        });
    });
    arr.x(coord.x()).y(coord.my() + 40);
});

sd.main(async () => {});
