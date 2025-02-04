import * as sd from "@/sd";

const svg = sd.svg();

sd.main(async () => {
    await TestDAGUpdate();
    await TestCreateEffectInEffect();
    await TestVarsNoChange();
    await TestRepeatDependency();
    await TestNestedRepeatDependency();
    await TestCircleDependency();
    await TestChainImpact();
});

async function TestCreateEffectInEffect() {
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    a.vars.merge({
        x: 10,
        y: 10,
        count: 0,
    });
    b.vars.merge({
        x: 0,
        y: 0,
    });
    a.effect("e1", () => {
        if (a.vars.count === 1) {
            b.effect("e2", () => {
                b.vars.x = a.vars.x + 10;
                b.vars.y = a.vars.y + 10;
            });
        }
    });
    console.assert(b.vars.x === 0 && b.vars.y === 0, "Effect initialize failed!");
    a.vars.count++;
    console.assert(b.vars.x === 20 && b.vars.y === 20, "Effect initialize failed!");
    console.log("Test Create Effect In Effect Passed!");
}

async function TestDAGUpdate() {
    let count = 0;
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    const c = new sd.SDNode(svg);
    const d = new sd.SDNode(svg);
    a.vars.merge({
        x: 0,
    });
    b.vars.merge({
        x: 0,
    });
    c.vars.merge({
        x: 0,
    });
    d.vars.merge({
        x: 0,
    });
    b.effect("e2", () => {
        console.log("e2 triggered!");
        b.vars.x = a.vars.x + 10;
    });
    c.effect("e3", () => {
        console.log("e3 triggered!");
        c.vars.x = a.vars.x + 20;
    });
    d.effect("e4", () => {
        count++;
        console.log("e4 triggered!");
        d.vars.x = d.vars.x + b.vars.x;
    });
    d.effect("e5", () => {
        console.log("e5 triggered!");
        d.vars.x = c.vars.x * 2;
    });
    console.assert(d.vars.x === 50, "Effect initialize failed!");
    console.assert(count === 2);
    a.vars.x = 20;
    console.assert(d.vars.x === 110, "Effect trigger failed!");
    console.assert(count === 3, "Fail to optimize!");
}

async function TestVarsNoChange() {
    let count = 0;
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    a.vars.merge({
        x: 0,
        flag: 0,
    });
    b.vars.merge({
        x: 0,
    });
    a.effect("e1", () => {
        console.log("e1 triggered!");
        if (a.vars.flag <= 0) a.vars.x = 10;
        else a.vars.x = 10;
    });
    b.effect("e2", () => {
        count++;
        console.log("e2 triggered!");
        b.vars.x = a.vars.x + 10;
    });
    a.vars.flag = 50;
    console.log("count=", count);
    console.assert(count === 1, "Fail to optimize!");
    console.log("Optimize Vars No Change Succeeded!");
}

async function TestNestedRepeatDependency() {
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    a.vars.merge({
        x: 0,
        y: 0,
        flag1: false,
        flag2: false,
    });
    b.vars.merge({
        x: 0,
        y: 0,
    });
    a.effect("e3", () => {
        console.log("e3 triggered!");
        if (a.vars.flag1) a.vars.flag2 = true;
    });
    b.effect("e2", () => {
        console.log("e2 triggered!");
        if (a.vars.flag2) {
            b.vars.x = b.vars.x + a.vars.x;
            b.vars.y = b.vars.y + a.vars.y;
        }
    });
    b.effect("e1", () => {
        console.log("e1 triggered!");
        if (a.vars.flag2) {
            b.vars.x = a.vars.x;
            b.vars.y = a.vars.y;
        }
    });
    a.vars.x = 10;
    console.assert(b.vars.x === 0 && b.vars.y === 0, "Effect trigger error!");
    a.vars.flag1 = true;
    console.log(b.vars.x, b.vars.y);
    console.assert(b.vars.x === 20 && b.vars.y === 0, "Effect trigger failed!");
    console.log("Test Nested Repeat Dependency Passed!");
}

async function TestRepeatDependency() {
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    a.vars.merge({
        x: 0,
        y: 0,
    });
    b.vars.merge({
        x: 0,
        y: 0,
    });
    b.effect("e2", () => {
        console.log("e2 triggered!");
        b.vars.x = b.vars.x + a.vars.x;
        b.vars.y = b.vars.y + a.vars.y;
    });
    b.effect("e1", () => {
        console.log("e1 triggered!");
        b.vars.x = a.vars.x;
        b.vars.y = a.vars.y;
    });
    console.assert(b.vars.x === 0 && b.vars.y === 0, "Effect initialize failed!");
    a.vars.x = 20;
    console.assert(b.vars.x === 40, "Effect trigger failed!");
    console.log("Test Repeat Dependency Passed!");
}

async function TestCircleDependency() {
    const a = new sd.SDNode(svg);
    const b = new sd.SDNode(svg);
    a.vars.merge({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });
    b.vars.merge({
        x: 0,
        y: 0,
        f: 0,
        w: 0,
        h: 0,
    });
    a.effect("e1", () => {
        b.vars.f = a.vars.w / 2;
        b.vars.x = a.vars.x + b.vars.w;
        b.vars.y = a.vars.y + b.vars.h;
    });
    b.effect("e2", () => {
        b.vars.w = b.vars.f + 10;
        b.vars.h = b.vars.f + 10;
    });
    console.assert(b.vars.x === 0 + 10, "Effect initialize failed!");
    console.assert(b.vars.y === 0 + 10, "Effect initialize failed!");
    a.vars.w = 10;
    console.assert(b.vars.x === 5 + 10, "Effect trigger failed!");
    console.assert(b.vars.y === 5 + 10, "Effect trigger failed!");
    a.vars.x = 5;
    console.assert(b.vars.x === 5 + 5 + 10, "Effect trigger failed!");
    console.assert(b.vars.y === 5 + 10, "Effect trigger failed!");
    console.log("Circle Dependency Test Passed!");
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
        console.log("a effect triggered!");
        b.x(a.x() + 10);
        b.y(a.y() + 10);
    });
    b.effect("hello", () => {
        console.log("b effect triggered!");
        c.x(b.x() + 10);
        c.y(b.y() + 10);
        console.log("c.x=", c.x(), "c.y=", c.y());
    });
    c.effect("hello", () => {
        console.log("c effect triggered!");
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
