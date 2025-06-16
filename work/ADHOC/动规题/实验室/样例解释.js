import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const m = 10;
const grid = new sd.Grid(svg).n(n).m(m);

sd.init(() => {
    grid.forEachElement(element => {
        let flag = 0;
        element.onClick(() => {
            sd.inter(async () => {
                element
                    .startAnimate()
                    .color(flag === 0 ? C.grey : C.white)
                    .endAnimate();
                flag ^= 1;
            });
        });
    });
});

sd.main(async () => {});
