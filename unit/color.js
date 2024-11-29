import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colorList = [
    C.darkRed,
    C.red,
    C.darkBlue,
    C.blue,
    C.darkOrange,
    C.orange
];
const arr = new sd.Array(svg).x(100).y(100);

sd.init(() => {
    colorList.forEach(color => {
        arr.push();
        arr.lastElement().color(C.ORANGE);
    });
})

sd.main(async () => {

})