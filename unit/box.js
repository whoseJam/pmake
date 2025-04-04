import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();

sd.init(() => {});

sd.main(TestText);

async function TestText() {
    const box = new sd.Box(svg);
    console.assert(box.text() === "");
    await sd.pause();
    box.text("a");
    console.assert(box.text() === "a");
}

async function TestLayout() {
    function addFocus(node) {
        sd.Focus(node).focus(node).strokeWidth(1).strokeDashArray([5, 5]);
    }
    const svg = sd.svg();
    const values = [new sd.Circle(svg), new sd.Mathjax(svg, "A^2"), new sd.Rect(svg), new sd.Text(svg, "A")];
    const boxes = [];
    values.forEach((value, i) => {
        addFocus(value);
        const box = new sd.Box(svg, value)
            .width(80)
            .height(80)
            .x(100 * i);
        boxes.push(box);
    });
    await sd.pause();
    boxes.forEach(box => box.startAnimate().height(60).endAnimate());
}

async function TestWithHTML() {
    const box = new sd.Box(svg, new sd.Button(div));
    await sd.pause();
    box.value().startAnimate().opacity(0.5).endAnimate();
    box.startAnimate().opacity(0.5).endAnimate();
}

async function TestIntValue() {
    const box1 = new sd.Box(svg, "1");
    const box2 = new sd.Box(svg, "1.8").x(100);
    const box3 = new sd.Box(svg).x(200);
    const box4 = new sd.Box(svg, "A").x(300);
    console.log(box1.intValue()); // 1
    console.log(box2.intValue()); // 1
    console.log(box3.intValue()); // 0
    // console.log(box4.intValue()); // this is invalid invoke
}

async function TestRate() {
    const box = new sd.Box(svg, "V");
    await sd.pause();
    box.startAnimate().rate(2).endAnimate(); // 提高空闲率，"V" 会显得很小
    await sd.pause();
    box.startAnimate().rate(1).endAnimate(); // 降低空闲率，"V" 会显得很大
}

async function TestBasic() {
    const box = new sd.Box(svg).cx(600).cy(300).value(new sd.Circle(svg));
    await sd.pause();
    let txt = "helloworld",
        str = [];
    for (let i = 0; i < txt.length; i++) {
        str.push(new sd.Text(svg, txt[i]).x(Math.random() * 1200).y(Math.random() * 600));
    }

    await sd.pause();
    for (let i = 0; i < str.length; i++) {
        let t = str[i];
        box.startAnimate().value(t.onEnter(EN.moveTo())).endAnimate();
    }

    await sd.pause();
    const b1 = new sd.Box(svg, "V").x(100).y(100);
    const b2 = new sd.Box(svg).x(200).y(100);
    await sd.pause();
    const e1 = b1.drop();
    b2.startAnimate().value(e1).endAnimate();
    await sd.pause();

    const b3 = new sd.Box(svg, "V").x(100).y(180);
    const b4 = new sd.Box(svg).x(200).y(180);
    await sd.pause();
    const e3 = b3.drop();
    // b3.startAnimate().value(null).endAnimate();
    b4.value(e3).endAnimate();
    await sd.pause();

    const b5 = new sd.Box(svg, "V").x(100).y(260);
    const b6 = new sd.Box(svg).x(200).y(260);
    await sd.pause();
    const e5 = b5.drop();
    b6.startAnimate().valueFromExist(e5).endAnimate();
    await sd.pause();

    const b7 = new sd.Box(svg, "V").x(100).y(340);
    const b8 = new sd.Box(svg).x(200).y(340);
    await sd.pause();
    const e7 = b7.drop();
    b8.after(b7).startAnimate().valueFromExist(e7).endAnimate();
}

async function TestTextCenter() {
    const box = new sd.Box(svg).center(600, 300).value("a");
}
