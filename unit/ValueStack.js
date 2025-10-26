import * as sd from "@/sd";

const svg = sd.svg();
const stk = new sd.ValueStack(svg).x(100).y(100);

sd.init(() => {

})

sd.main(async () => {
    await sd.pause();
    stk.startAnimate().push(1).endAnimate();
    stk.startAnimate().push(new sd.Box(svg).width(100).opacity(0)).endAnimate();
    stk.startAnimate().push(new sd.Circle(svg).opacity(0)).endAnimate();
    stk.startAnimate().push(new sd.Line(svg).opacity(0)).endAnimate();
    await sd.pause();
    stk.startAnimate().elementHeight(60).endAnimate();
    await sd.pause();
    stk.startAnimate().align("x").endAnimate();
    await sd.pause();
    stk.startAnimate().align("mx").endAnimate();

    const box1 = new sd.Box(svg).x(500).y(100);
    const box2 = new sd.Box(svg).x(500).y(200);
    await sd.pause();
    stk.startAnimate().pushFromExistElement(box1).endAnimate();
    await sd.pause();
    stk.startAnimate().pushFromExistValue(box2).endAnimate();
})