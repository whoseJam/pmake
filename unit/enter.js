import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const element = new sd.Box(svg).x(100).y(100);
const value = new sd.Circle(svg).x(100).y(200);

sd.init(() => {

})

sd.main(async () => {
})

async function TestEnterWhileAnimating(params) {
    
}

async function TestBasic(params) {
    await sd.pause();
    element.after(300).startAnimate().value(value.onEnter(EN.moveTo())).endAnimate();
    await sd.pause();
    element.startAnimate().drop().endAnimate();
}