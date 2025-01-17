import * as sd from "@/sd";

const div = sd.div();

sd.main(TestTextAreaChaining);

async function TestBasicTextAreaFunctionality() {
    const textarea = new sd.TextArea(div);
    await sd.pause();
    textarea.x(100).y(100).width(150).height(100);
    console.assert(
        textarea.x() === 100 && 
        textarea.y() === 100 && 
        textarea.width() === 150 && 
        textarea.height() === 100, 
        "Position and size setting test failed"
    );
    await sd.pause();
    textarea.value("测试文本");
    console.assert(textarea.value() === "测试文本", "Value setting test failed");
    console.log("Basic textarea functionality test passed");
}

async function TestTextAreaAnimation() {
    const textarea = new sd.TextArea(div);
    await sd.pause();
    textarea.startAnimate()
        .x(200)
        .y(200)
        .width(150)
        .height(100)
        .value("动画文本框")
        .endAnimate();
    console.log("TextArea animation test passed");
}

async function TestTextAreaCallback() {
    const textarea = new sd.TextArea(div);
    let callbackTriggered = false;
    textarea.onChange((value) => {
        callbackTriggered = true;
        console.assert(value === "新文本", "Callback value test failed");
        console.log("onChange callback triggered with value:", value);
    });
    await sd.pause();
    textarea._.nake.setAttribute("value", "新文本");
    textarea._.nake.getAttribute("onchange")();
    console.assert(callbackTriggered, "Callback test failed");
    console.log("TextArea callback test passed");
}

async function TestTextAreaChaining() {
    const textarea = new sd.TextArea(div);
    await sd.pause();
    textarea.x(150)
        .y(150)
        .width(150)
        .height(100)
        .value("链式调用")
        .onChange((value) => console.log("Changed value:", value));
    console.assert(
        textarea.x() === 150 && 
        textarea.y() === 150 && 
        textarea.width() === 150 &&
        textarea.height() === 100 &&
        textarea.value() === "链式调用",
        "Method chaining test failed"
    );
    console.log("TextArea chaining test passed");
}