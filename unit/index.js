import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestIndexTarget);

async function TestIndexTarget() {
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1).n(5).m(3);
    const arr = new sd.Array(svg).x(100).y(500).start(1).resize(5);
    const stk = new sd.Stack(svg).x(500).y(100).resize(8).start(2);
    await sd.pause();
    const index = sd.Index(grid, "t").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    index.startAnimate().target(arr).endAnimate();
    await sd.pause();
    index.startAnimate().freeze().target(stk).location("l").unfreeze().endAnimate();
}

async function TestGridIndex() {
    const locations = ["b", "l", "r", "t"];
    const n = 5;
    const grid = new sd.Grid(svg).x(100).y(100).startN(1).startM(1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i + 1; j++) {
            grid.insert(i, j, `${i},${j}`);
        }
    }
    await sd.pause();
    const index = sd.Index(grid, "t");
    index.opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    grid.startAnimate().align("cx").endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    grid.startAnimate().align("mx").endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    grid.startAnimate().axis("col").align("y").endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    grid.startAnimate().align("cy").endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
    await sd.pause();
    grid.startAnimate().align("my").endAnimate();
    for (let i = 0; i < locations.length; i++) {
        await sd.pause();
        index.startAnimate().location(locations[i]).endAnimate();
    }
}

async function TestBasicIndexFunctionality() {
    const grid = new sd.Grid(svg).x(100).y(100).m(3).n(3);
    const index = new sd.Index(grid);
    console.assert(index.type() === "Index", "Type setting test failed");
    console.assert(index.gap() === 3, "Default gap test failed");
    console.assert(index.location() === "t", "Default location test failed");
    console.assert(index.fontSize() === 15, "Default fontSize test failed");
    console.log("Basic index functionality test passed");
    await sd.pause();
    index.startAnimate().location("b").endAnimate();
    await sd.pause();
    grid.startAnimate().startM(1).endAnimate();
    await sd.pause();
    index.startAnimate().location("l").endAnimate();
}

async function TestIndexLocation() {
    const grid = new sd.Grid(svg).x(100).y(200).m(3).n(3);
    const index = new sd.Index(grid, "l");
    await sd.pause();
    console.assert(index.location() === "l", "Location setting test failed");
    index.location("r");
    console.assert(index.location() === "r", "Location change test failed");
    console.log("Index location test passed");
}

async function TestIndexCustomization() {
    const grid = new sd.Grid(svg).x(100).y(300).m(3).n(3);
    const index = new sd.Index(grid, "t", 20, 5);
    await sd.pause();
    console.assert(index.fontSize() === 20, "FontSize setting test failed");
    console.assert(index.gap() === 5, "Gap setting test failed");
    index.startAnimate().fontSize(30).gap(8).endAnimate();
    console.assert(index.fontSize() === 30 && index.gap() === 8, "Property update test failed");
    console.log("Index customization test passed");
}

async function TestIndexAssociation() {
    const grid = new sd.Grid(svg).x(100).y(400).m(3).n(3);
    const index = new sd.Index(grid);
    await sd.pause();
    grid.startAnimate().m(4).endAnimate();
    await sd.pause();
    const elements = index.vars.elements;
    console.assert(elements.length === 4, "Grid association test failed");
    console.log("Index association test passed");
}
