import * as sd from "@/sd";

const svg = sd.svg();
const T = sd.timingFunction();

sd.init(() => {});

sd.main(TestBackEaseInOut);

async function TestBackEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.backEaseIn, T.backEaseOut, T.backEaseInOut];
    const names = ["linear", "backEaseIn", "backEaseOut", "backEaseInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(1000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestBounceEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.bounceEaseIn, T.bounceEaseOut, T.bounceEaseInOut];
    const names = ["linear", "bounceEaseIn", "bounceEaseOut", "bounceEaseInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(2000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestElasticEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.elasticEaseIn, T.elasticEaseOut, T.elasticEaseInOut];
    const names = ["linear", "elasticEaseIn", "elasticEaseOut", "elasticEaseInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(1000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestCubicEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.cubicEaseIn, T.cubicEaseOut, T.cubicEaseInOut];
    const names = ["linear", "cubicEaseIn", "cubicEaseOut", "cubicEaseInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(1000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestQuadEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.quadEaseIn, T.quadEaseOut, T.quadEaseInOut];
    const names = ["linear", "quadEaseIn", "quadEaseOut", "quadEaseInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(1000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestEaseInOut() {
    const nodes = [];
    const timingFunctions = [T.linear, T.easeIn, T.easeOut, T.easeInOut];
    const names = ["linear", "easeIn", "easeOut", "easeInOut"];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(200).y(100 + i * 120);
        const name = new sd.Text(svg, names[i]).cx(node.cx()).my(node.y() - 5);
        nodes.push(node);
        if (i > 0) new sd.Line(svg).source(100, 60 + i * 120).target(800, 60 + i * 120);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(1000, timingFunctions[i]).dx(500).endAnimate();
    }
}

async function TestTimingFunction() {
    const nodes = [];
    const timingFunctions = [
        T.linear,
        T.easeIn,
        T.easeOut,
        T.easeInOut,
        T.quadEaseIn,
        T.quadEaseOut,
        T.quadEaseInOut,
        T.cubicEaseIn,
        T.cubicEaseOut,
        T.cubicEaseInOut,
        T.elasticEaseIn,
        T.elasticEaseOut,
        T.elasticEaseInOut,
        T.bounceEaseIn,
        T.bounceEaseOut,
        T.bounceEaseInOut,
        T.backEaseIn,
        T.backEaseOut,
        T.backEaseInOut,
    ];
    for (let i = 0; i < timingFunctions.length; i++) {
        const node = new sd.Circle(svg).x(100 + i * 60).y(100);
        nodes.push(node);
    }
    await sd.pause();
    for (let i = 0; i < timingFunctions.length; i++) {
        nodes[i].startAnimate(timingFunctions[i]).y(400).endAnimate();
    }
}
