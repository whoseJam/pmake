import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

sd.main(TestSliderHTMLAndSVG);

async function TestSliderHTMLAndSVG() {
    const s1 = new sd.Slider(svg)
        .x(100)
        .y(100)
        .onChange(v => console.log("s1 v=", v));
    const s2 = new sd.Slider(div)
        .x(100)
        .y(200)
        .onChange(v => console.log("s2 v=", v));
    await sd.pause();
    await sd.pause();
    await sd.pause();
    await sd.pause();
}

async function TestBasicSliderFunctionality() {
    const slider = new sd.Slider(div);
    await sd.pause();
    slider.x(100).y(100);
    slider.min(0).max(100);
    console.assert(slider.min() === 0 && slider.max() === 100, "Min/Max setting test failed");
    slider.value(50);
    console.assert(slider.value() === 50, "Value setting test failed");
    console.log("Basic slider functionality test passed");
}

async function TestSliderAnimation() {
    const slider = new sd.Slider(div);
    await sd.pause();
    slider.startAnimate().x(200).y(200).value(75).endAnimate();
    console.log("Slider animation test passed");
}

async function TestSliderCallback() {
    const slider = new sd.Slider(div);
    let callbackTriggered = false;

    slider.onChange(value => {
        callbackTriggered = true;
        console.log("onChange callback triggered with value:", value);
    });

    await sd.pause();
    slider.value(25);
    console.assert(callbackTriggered, "Callback test failed");
    console.log("Callback test passed");
}

async function TestSliderBoundaries() {
    const slider = new sd.Slider(div);
    slider.min(0).max(100).value(50);
    await sd.pause();
    // Test value clamping
    slider.value(-10);
    console.assert(slider.value() === 0, "Lower boundary test failed");
    slider.value(150);
    console.assert(slider.value() === 100, "Upper boundary test failed");
    console.log("Boundary tests passed");
}
