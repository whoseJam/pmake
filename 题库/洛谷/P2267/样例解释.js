import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colors = [C.red, C.red, C.blue, C.green, C.green, C.red, C.green, C.green, C.red, C.red, C.red, C.red];
const arr = new sd.Array(svg).resize(colors.length);

sd.init(() => {
    for (let i = 0; i < colors.length; i++) {
        arr.color(i, colors[i]);
        arr.value(i, " ");
        arr.element(i).onClick(() => {
            if (arr.text(i) !== "✔") {
                arr.text(i, "✔");
            } else {
                arr.text(i, " ");
            }
        })
    }
})

sd.main(async () => {

})