import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const C = sd.color();
const data = [1, 3, 2, 4, 5];
const arr = new sd.Array(svg).elementWidth(60);
const startInput = new sd.Slider(div).min(1).max(5).value(1);
const endInput = new sd.Slider(div).min(1).max(5).value(5);
const button = new sd.Button(div).text("查询");

sd.init(() => {
    arr.push(" ").pushArray(data);
    sd.Label(startInput, "左端点");
    sd.Label(endInput, "右端点");
    startInput.x(arr.x()).y(arr.my() + 20);
    endInput.x(arr.x()).y(startInput.my() + 20);
    button.x(arr.x()).y(endInput.my() + 20);
    button.onClick(() => {
        const start = startInput.value();
        const end = endInput.value();
        const l = Math.min(start, end);
        const r = Math.max(start, end);
        sd.inter(async () => {
            arr.startAnimate().color(l, r, C.blue).endAnimate();
            await sd.pause();
            arr.startAnimate().color(l, r, C.white).endAnimate();
        });
    });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    let ans = "";
    for (let i = 0; i <= data.length; i++) {
        if (i > 0) ans = ans + data[i - 1];
        arr.element(i).startAnimate().childAs("label", new sd.Text(svg, ans), R.aside("bc", 0)).endAnimate();
    }
});
