import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 25;
const arr = new sd.Array(svg).x(100).y(400);

sd.init(() => {
    sd.freeze();
    arr.resize(n).start(1);
    sd.unfreeze();
});

sd.main(async () => {
    await sd.pause();
});
