import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).viewBox(-2, -2, 6, 4).width(240).height(160);
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
    pen.MoveTo(coord.globalAt(0, 0));
    path.d(pen.toString());
    data.forEach((point, i) => {
        const circle = new sd.Vertex(coord, i + 1).r(15).center(coord.globalAt(point));
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().color(C.blue).endAnimate();
                arr.startAnimate()
                    .push(i + 1)
                    .endAnimate();
                pen.LinkTo(coord.globalAt(point));
                path.startAnimate().d(pen.toString()).endAnimate();
            });
            circle.onClick(null);
        });
    });
    arr.x(coord.x()).y(coord.my() + 20);
});

sd.main(async () => {});
