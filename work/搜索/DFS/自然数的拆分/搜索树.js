import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const tree = new sd.ValueTree(svg).width(1000).dy(22);
const arr = [];
let tot = 0;

sd.init(() => {
    dfs(1, 1, 0);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    tree.element(1).onClick(() => {
        sd.inter(async () => {
            await clickNode(1);
        });
    });
});

sd.main(async () => {});

function dfs(d, lim, sum) {
    const current = ++tot;
    tree.newNode(current, makeSplit(arr));
    if (d === n + 1) return current;
    for (let i = lim; i <= n; i++) {
        if (sum + i <= n) {
            arr.push(i);
            tree.newLink(current, dfs(d + 1, i, sum + i));
            arr.pop();
        }
    }
    return current;
}

async function clickNode(x) {
    const element = tree.element(x);
    element.onClick(null);
    tree.children(element).forEach(child => {
        const link = tree.element(x, child);
        link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        child.startAnimate().opacity(1).endAnimate();
        child.onClick(() => {
            sd.inter(async () => {
                await clickNode(tree.nodeId(child));
            });
        });
    });
    if (tree.children(element).length === 0) {
        element
            .startAnimate()
            .color(sum(element) === n ? C.orange : C.red)
            .endAnimate();
    }
}

function sum(arr) {
    let ans = 0;
    arr.forEachElement(element => (ans += element.intValue()));
    return ans;
}

function makeSplit(arr) {
    if (arr.length === 0) return new sd.Text(tree, "空数组");
    const array = new sd.Array(tree).elementWidth(20).elementHeight(20).pushArray(arr);
    return array;
}
