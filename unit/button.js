import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

sd.main(TestButtonHTMLAndSVG);

async function TestButtonHTMLAndSVG() {
    const b1 = new sd.Button(svg)
        .onClick(() => console.log("ButtonSVG clicked!"))
        .x(100)
        .y(100);
    const b2 = new sd.Button(div)
        .onClick(() => console.log("ButtonHTML clicked!"))
        .x(100)
        .y(200);
}

async function TestBasicButtonFunctionality() {
    const button = new sd.Button(div);
    await sd.pause();
    button.x(100).y(100).width(100);
    console.assert(button.x() === 100 && button.y() === 100 && button.width() === 100, "Position setting test failed");
    await sd.pause();
    button.text("测试按钮");
    console.assert(button.text() === "测试按钮", "Text setting test failed");
    console.log("Basic button functionality test passed");
}

async function TestButtonAnimation() {
    const button = new sd.Button(div);
    await sd.pause();
    button.startAnimate().x(200).y(200).width(100).text("动画按钮").endAnimate();
    console.log("Button animation test passed");
}

async function TestButtonCallback() {
    const button = new sd.ButtonHTML(div);
    let callbackTriggered = false;
    button.onClick(() => {
        callbackTriggered = true;
        console.log("onClick callback triggered");
    });
    await sd.pause();
    button._.nake.getAttribute("onclick")();
    console.assert(callbackTriggered, "Callback test failed");
    console.log("Button callback test passed");
}

async function TestButtonChaining() {
    const button = new sd.Button(div);
    await sd.pause();
    button
        .x(150)
        .y(150)
        .width(100)
        .text("链式调用")
        .onClick(() => console.log("Chained callback"));
    console.assert(button.x() === 150 && button.y() === 150 && button.text() === "链式调用", "Method chaining test failed");
    console.log("Button chaining test passed");
}
