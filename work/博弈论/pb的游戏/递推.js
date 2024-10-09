import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const F = new sd.Array(svg).resize(10).start(1);

sd.init(() => {
    sd.Index(F, "t");
})

sd.main(async () => {
    const p1 = sd.Pointer(F, " ", "t");
    const p2 = sd.Pointer(F, " ", "t");
    await sd.pause();
    F.startAnimate().value(1, 0).endAnimate();
    for (let i = 2; i <= 10; i++) {
        await sd.pause();
        F.startAnimate().color(i, C.blue).endAnimate();
        let flag = false;
        for (let j = 1; j <= (i >> 1); j++) {
            await sd.pause();
            F.startAnimate();
            p1.moveTo(j);
            p2.moveTo(i - j);
            F.endAnimate();
            const a = F.intValue(j);
            const b = F.intValue(i - j);
            if (!a && !b) {
                flag = true;
                break;
            }
        }
        await sd.pause();
        F.startAnimate().value(i, flag ? 1 : 0).endAnimate();
        await sd.pause();
        F.startAnimate();
        p1.moveTo(null);
        p2.moveTo(null);
        F.color(i, C.white);
        F.endAnimate();
    }
})