import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const eggs = [
    [1, 5],
    [2, 4],
    [4, 6],
    [5, 1],
    [6, 5],
    [8, 3],
    [10, 4],
];
const circles = [];
const l = 2;
const r = 5;

sd.init(() => {
    eggs.forEach((egg, id) => {
        if (egg === undefined) circles.push(undefined);
        else {
            const circle = new sd.Circle(svg).center(pos(egg)).color(l <= id && id <= r ? C.grey : C.cyan);
            circle.childAs("arrow", new sd.Line(circle).arrow(), function (parent, child) {
                child.source(parent.pos("cx", "my"));
                child.target(parent.pos("cx", "my", 0, 20));
            });
            circles.push(circle);
        }
    });
    const x = new sd.Line(svg)
        .source(0, 50)
        .target(eggs[eggs.length - 1][0] * 50 + 50, 50)
        .arrow();
    const y = new sd.Line(svg)
        .source(0, 50)
        .target(0, -30 * 8)
        .arrow();
    const brace = sd.Brace(svg).brace(circles[l], circles[r], "t").value("已收集");
    sd.Pointer(svg, "l", "b", 3, 20).opacity(1).source(0, 0).target(0, 20).my(brace.y()).cx(circles[l].cx());
    sd.Pointer(svg, "r", "b", 3, 20).opacity(1).source(0, 0).target(0, 20).my(brace.y()).cx(circles[r].cx());
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    circles[l].startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
});

function pos(vec) {
    return [vec[0] * 50, -30 * vec[1]];
}
