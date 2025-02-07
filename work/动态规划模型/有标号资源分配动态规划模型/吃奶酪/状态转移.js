import * as sd from "@/sd";
import { binaryMath } from "../_/BinaryMath";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).viewBox(-2, -2, 6, 4).width(240).height(160);
const path = new sd.Path(svg).arrow().stroke(C.textBlue);
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
    const math = binaryMath(data.length);
    pen.MoveTo(coord.globalAt(0, 0));
    path.d(pen.toString());
    data.forEach((point, i) => {
        const circle = new sd.Vertex(coord, i + 1).r(15).center(coord.globalAt(point));
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().color(C.blue).endAnimate();
                pen.LinkTo(coord.globalAt(point));
                math.startAnimate()
                    .set(i + 1, 1)
                    .endAnimate();
                path.startAnimate().d(pen.toString()).endAnimate();
            });
            circle.onClick(null);
        });
    });
    math.cx(coord.cx()).y(coord.my() + 20);
});

sd.main(async () => {});

async function onChangeStatus(i, selected) {
    const color = selected ? C.blue : C.white;
    arr.startAnimate().color(i, color).endAnimate();
    arr.element(i).circle.startAnimate().color(color).endAnimate();
}
