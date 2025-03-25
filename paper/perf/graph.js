import * as sd from "@/sd";

const svg = sd.svg();
const n = 20;
const m = 20;
const e = 100;
const graph = new sd.GridGraph(svg).n(n).m(m);
const seed = 13123;

function rand(l, r) {
    const current = global["currentValue"] || seed;
    const next = ((current + seed * 14131 + 22113) % (r - l + 1)) + l;
    global["currentValue"] = next;
    return next;
}

sd.init(() => {
    sd.freeze();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            console.log(i, j);
            graph.at(i, j).newNode((i - 1) * n + j, " ");
        }
    }
    for (let i = 1; i <= e; i++) {
        console.log(`${i}/${e}`);
        const x1 = rand(1, n);
        const y1 = rand(1, m);
        const x2 = rand(1, n);
        const y2 = rand(1, m);
        graph.link((x1 - 1) * n + y1, (x2 - 1) * n + y2);
    }
    sd.unfreeze();
});

sd.main(async () => {
    await sd.pause();
});
