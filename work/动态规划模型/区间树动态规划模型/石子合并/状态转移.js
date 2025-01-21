import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();
const n = 10;
const arr = new sd.Array(svg).resize(n);
const root = new sd.Rect(svg);
const left = new sd.Rect(svg);
const right = new sd.Rect(svg);
const leftLink = sd.Link(root, left, sd.Line, "cx", "my", "cx", "y").arrow();
const rightLink = sd.Link(root, right, sd.Line, "cx", "my", "cx", "y").arrow();

sd.init(() => {
    sd.Brace(arr)
        .brace(0, n - 1, "t")
        .value("n堆石子");
    root.width(n * 40 - 10)
        .height(10)
        .cx(arr.cx())
        .y(arr.my() + 10);
    left.width(30)
        .height(10)
        .cx(arr.element(0).cx())
        .y(root.my() + 20);
    right
        .width((n - 1) * 40 - 10)
        .height(10)
        .cx((arr.element(1).cx() + arr.element(n - 1).cx()) / 2)
        .y(root.my() + 20);
});

sd.main(async () => {
    await sd.pause();
    const leftRect = new sd.Rect(left).height(100);
    left.startAnimate().childAs(leftRect.onEnter(EN.appear()), (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    const rightRect = new sd.Rect(right).height(100);
    right.startAnimate().childAs(rightRect.onEnter(EN.appear()), (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    await sd.pause();
    leftRect.startAnimate().childAs(new sd.Text(leftRect, "?").onEnter(EN.appear()), R.centerOnly()).endAnimate();
    rightRect.startAnimate().childAs(new sd.Text(rightRect, "?").onEnter(EN.appear()), R.centerOnly()).endAnimate();
    for (let i = 1; i < n - 1; i++) {
        await sd.pause();
        left.startAnimate().width((i + 1) * 40 - 10);
        leftLink.target(left.pos("cx", "y"));
        left.endAnimate();
        right
            .startAnimate()
            .width((n - i - 1) * 40 - 10)
            .mx(arr.mx() - 5);
        rightLink.target(right.pos("cx", "y"));
        right.endAnimate();
    }
});
