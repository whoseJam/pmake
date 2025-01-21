import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();
const n = 5;
const arr = new sd.Array(svg).resize(n * 2).start(1);

sd.init(() => {
    sd.Brace(arr, 1, n * 2, "t").value("2n");
    for (let i = 1; i <= n; i++) arr.value(i, `R${i}`);
    for (let i = n + 1; i <= 2 * n; i++) arr.value(i, `R${i - n}`);
});

sd.main(async () => {
    await sd.pause();
    const root = new sd.Rect(svg)
        .width(n * 40 - 10)
        .height(10)
        .cx((arr.element(1).cx() + arr.element(n).cx()) / 2)
        .y(arr.my() + 10)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .childAs(new sd.Rect(svg).height(100).childAs(new sd.Text(svg, "?"), R.centerOnly()), function (parent, child) {
            child.x(parent.x()).y(parent.my()).width(parent.width());
        })
        .endAnimate();
    for (let i = 1; i < n; i++) {
        await sd.pause();
        root.startAnimate().dx(40).endAnimate();
    }
});
