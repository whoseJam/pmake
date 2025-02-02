import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestBox);

async function TestBox() {
    const arr = new sd.Array(svg).resize(10).x(100).y(100);
    await sd.pause();
    arr.startAnimate().value(1, "a").value(4, "b").endAnimate();
}

async function TestInitWithGlobalFreeze() {
    sd.freeze();
    new sd.Box(svg, "a").x(100).y(100);
    sd.unfreeze();
}

async function TestChainImpact() {
    const a = new sd.Rect(svg);
    const b = new sd.Rect(svg);
    const c = new sd.Rect(svg);
    const d = new sd.Rect(svg);
    a.effect("hello", () => {
        b.x(a.x() + 10);
        b.y(a.y() + 10);
    });
    b.effect("hello", () => {
        c.x(b.x() + 10);
        c.y(b.y() + 10);
    });
    c.effect("hello", () => {
        d.x(c.x() + 10);
        d.y(c.y() + 10);
    });
    sd.freeze();
    await sd.pause();
    a.x(100).y(100);
    await sd.pause();
    sd.unfreeze();
}

async function TestEffectFreeze() {
    const a = new sd.Rect(svg);
    const b = new sd.Rect(svg);
    a.effect("hello", () => {
        b.x(a.x() + 10);
        b.y(a.y() + 10);
    });
    a.effect("hello").freeze();
    a.x(100).y(100);
    console.assert(b.x() === 10 && b.y() === 10, "Effect freeze failed!");
    await sd.pause();
    a.effect("hello").unfreeze();
    console.assert(b.x() === 110 && b.y() === 110, "Effect unfreeze failed!");
}

async function TestObjectFreeze() {
    const a = new sd.Rect(svg);
    const b = new sd.Rect(svg);
    a.effect("hello", () => {
        b.x(a.x() + 10);
        b.y(a.y() + 10);
    });
    a.freeze().x(100).y(100);
    console.assert(b.x() === 10 && b.y() === 10, "Object freeze failed!");
    await sd.pause();
    a.unfreeze();
    console.assert(b.x() === 110 && b.y() === 110, "Object unfreeze failed!");
}

async function TestGlobalFreeze() {
    const a = new sd.Rect(svg);
    const b = new sd.Rect(svg);
    a.effect("hello", () => {
        b.x(a.x() + 10);
        b.y(a.y() + 10);
    });
    sd.freeze();
    a.x(100).y(100);
    console.assert(b.x() === 10 && b.y() === 10, "Global freeze failed!");
    await sd.pause();
    sd.unfreeze();
    console.assert(b.x() === 110 && b.y() === 110, "Global unfreeze failed!");
}
