import * as sd from "@/sd";

const svg = sd.svg();
const n = 25;
const seed = 11;
const tree = new sd.Tree(svg);

function rand(l, r) {
    const current = global["currentValue"] || seed;
    const next = ((current + seed * 14131 + 22113) % (r - l + 1)) + l;
    global["currentValue"] = next;
    return next;
}

sd.init(() => {
    sd.freeze();
    tree.root(1);
    for (let i = 2; i <= n; i++) {
        const fa = rand(1, i - 1);
        tree.link(fa, i);
    }
    sd.unfreeze();
});

sd.main(async () => {
    await sd.pause();
});
