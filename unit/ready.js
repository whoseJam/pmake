import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {
    
})

sd.main(TestArray)

async function TestArray() {
    await sd.pause();
    const arr = new sd.Array(svg).x(100).y(100).resize(10);
    const b1 = sd.Brace(arr);
    const b2 = sd.Brace(arr).brace(1, 7);
    await sd.pause();
    b2.startAnimate().opacity(0).endAnimate();
    await sd.pause();
    b1.startAnimate().brace(2, 4, "b", 5).endAnimate();
    b2.after(b1).brace(2, 4, "b", 5);
    await sd.pause();
    b2.startAnimate().brace(4, 6, "b", 15).endAnimate();
}

async function TestRect() {
    await sd.pause();
    const r1 = new sd.Rect(svg).opacity(0).x(100).y(100).startAnimate().opacity(1).endAnimate();
    const r2 = new sd.Rect(svg).opacity(0).after(r1).center(r1.center()).opacity(1);
    await sd.pause();
    r2.startAnimate().dx(100).endAnimate();
}