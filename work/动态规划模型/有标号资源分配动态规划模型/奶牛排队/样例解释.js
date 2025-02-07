import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [3, 4, 2, 1];
const arr = new sd.Array(svg).start(1);
const ans = new sd.Array(svg).dy(80).start(1);

sd.init(() => {
    arr.pushArray(data);
    sd.Brace(arr).brace(1, data.length, "t").value("n");
    sd.Label(arr, "K=1", "rc");
    arr.forEachElement((element, id) => {
        element.onClick(() => {
            sd.inter(async () => {
                element.startAnimate().color(C.blue).endAnimate();
                ans.startAnimate().push(element.text()).endAnimate();
                element.onClick(null);
            });
        });
    });
});

sd.main(async () => {});
