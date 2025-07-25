import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const n = 5;
const d = new sd.Grid(svg).n(n).m(n);
const a = new sd.Grid(svg).n(n).m(n).dx(400);

sd.init(() => {
    sd.Label(a, "a", "tc");
    sd.Label(d, "d", "tc");
    d.forEachElement((element, i, j) => {
        element.onClick(() => {
            sd.inter(async () => {
                await onAdd(i, j, +1);
            });
        });
        element.onDblClick(() => {
            sd.inter(async () => {
                await onAdd(i, j, -1);
            });
        });
    });
});

sd.main(async () => {});

async function onAdd(x, y, d_) {
    d.startAnimate()
        .text(x, y, d.intValue(x, y) + d_)
        .endAnimate();
    a.startAnimate();
    for (let i = x; i < n; i++) for (let j = y; j < n; j++) a.text(i, j, a.intValue(i, j) + d_);
    a.endAnimate();
}
