import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 6;
const tree = new sd.ValueTree(svg).width(900).layerHeight(100);
const stack = new sd.ValueStack(svg).elementHeight(100).y(tree.y());
const items = [
    { value: 4, volume: 5, count: 2 },
    { value: 1, volume: 1, count: 2 },
    { value: 2, volume: 4, count: 3 },
    { value: 3, volume: 2, count: 2 }
];
tree.cx(700).y(50);
stack.mx(tree.x() - 20);
let tot = 1;

init();
main();

function makeBackpack(capacity, idx) {
    const result = new sd.Rect(svg).width(30).height(50);
    result.childAs("content", new sd.Rect(svg).color(C.blue), function(parent, child) {
        child.width(parent.width()).height(parent.height() * capacity / m);
        child.x(parent.x()).my(parent.my());
    });
    const myId = tot;
    if (idx >= items.length) return result;

    result.onClick(() => {
        result.onClick(() => {});
        for (let k = 0; k * items[idx].volume <= capacity && k <= items[idx].count; k++) {
            tree.newNode(++tot, makeBackpack(capacity - k * items[idx].volume, idx + 1));
            if (k > 0) tree.newLink(myId, tot, `+${k * items[idx].value}`);
            else tree.newLink(myId, tot);
        }
    });
    return result;
}

function init() {
    tree.root(1, makeBackpack(m, 0));
    items.forEach(item => {
        stack.push(new sd.Text(stack, `体积=${item.volume} 价值=${item.value} 数量=${item.count}`));
    });
}

async function main() {
    await sd.pause();
}
