import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 3;
const r = 6;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "l").moveTo(l);
});

sd.main(async () => {
    await sd.pause();
    sd.Brace(arr, "b").brace(l, r).stroke(C.green).strokeWidth(2).startAnimate().pointTtoS().value("unique").endAnimate();
    sd.Brace(arr, "b")
        .brace(r + 1, n)
        .stroke(C.grey)
        .strokeWidth(2)
        .startAnimate()
        .pointTtoS()
        .value("not unique")
        .endAnimate();
    await sd.pause();
    const pR = sd.Pointer(arr, "r").startAnimate().moveTo(r).endAnimate();
    await sd.pause();
    const value = pR.value();
    console.log("value=", value, "value.text=", value.text());
    value.startAnimate().text("r(Fl)", { r: "r" }).endAnimate();
});
