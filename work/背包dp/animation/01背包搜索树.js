import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 6;
const tree = new sd.ValueTree(svg).width(1000);
const items = [
    { value: 4, volume: 5 },
    { value: 1, volume: 1 },
    { value: 2, volume: 4 },
    { value: 3, volume: 2 }
];
tree.cx(600).y(50);
let tot = 1;

init();
main();

function makeBackpack(capacity, idx) {
    const result = new sd.Rect(svg).width(60).height(100);
    result.childAs("content", new sd.Rect(svg).color(C.blue), function(parent, child) {
        child.width(parent.width()).height(parent.height() * capacity / m);
        child.x(parent.x()).my(parent.my());
    });
    const myId = tot;
    if (idx >= items.length) return;

    result.onClick(() => {
        result.onClick(() => {});
        if (capacity >= items[idx].volume) {
            tree.newNode(++tot, makeBackpack(capacity - items[idx].volume, idx + 1));
            console.log("myid=", myId, tree.element(myId));
            console.log("tot=", tot, tree.element(tot));
            tree.newLink(myId, tot, `+${items[idx].value}`);
        }
        tree.newNode(++tot, makeBackpack(capacity, idx + 1));
        tree.newLink(myId, tot);
    });
    return result;
}

function init() {
    tree.root(1, makeBackpack(m, 0));
}

async function main() {
    await sd.pause();
}
