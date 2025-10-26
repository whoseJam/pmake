import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.BarArray(svg).start(1);
const data = [7, 8, 6, 9, 1, 3, 4, 6, 2, 8, 4];

sd.init(() => {
    arr.x(100).y(500).pushArray(data);
});

sd.main(async () => {
    for (let i = 1; i <= arr.length(); i++) {
        await sd.pause();
        arr.startAnimate().color(1, C.orange).endAnimate();
        for (let j = 1; j <= arr.length() - i; j++) {
            await sd.pause();
            arr.startAnimate();
            if (arr.intValue(j) > arr.intValue(j + 1)) {
                const element = arr.dropElement(j);
                arr.insertFromExistElement(j + 1, element);
            } else {
                arr.color(j, C.white).color(j + 1, C.orange);
            }
            arr.endAnimate();
        }
        await sd.pause();
        arr.startAnimate()
            .color(arr.length() - i + 1, C.blue)
            .endAnimate();
    }
});
