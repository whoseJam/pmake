import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const R = sd.rule();

sd.init(() => {});

sd.main(TestBasic);

async function TestEnterWhileAnimating() {
    const element = new sd.Box(svg).x(100).y(100).opacity(0);
    await sd.pause();
    element.startAnimate().opacity(1).childAs(new sd.Circle(svg).onEnter(EN.appear()), R.aside("bc")).endAnimate();
}

async function TestBasic() {
    const element = new sd.Box(svg).x(100).y(100);
    const value = new sd.Circle(svg).x(100).y(200);
    await sd.pause();
    element.after(300).startAnimate().value(value.onEnter(EN.moveTo())).endAnimate();
    await sd.pause();
    element.startAnimate().drop().endAnimate();
}
