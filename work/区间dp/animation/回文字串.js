import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = "Abc3bAd";
const tree = new sd.ValueTree(svg).width(1000);
tree.cx(600).y(50);
let tot = 1;

init();
main();

function makeSplit(l, r) {
    let result;
    const myId = tot;
    const array = new sd.Array(tree).elementWidth(20).elementHeight(20);
    for (let i = l; i <= r; i++)
        array.push(data[i]);
    result = array;
    
    result.onClick(() => {
        result.onClick(() => {});
        if (l === r) {
            array.color(C.green);
            return;
        }
        tree.freeze();
        if (data[l] === data[r]) {
            tree.newNode(++tot, makeSplit(l + 1, r - 1));
            tree.newLink(myId, tot);
            tree.element(myId, tot).strokeDashArray([5, 5]);
        }
        tree.newNode(++tot, makeSplit(l + 1, r)); tree.newLink(myId, tot);
        tree.newNode(++tot, makeSplit(l, r - 1)); tree.newLink(myId, tot);
        tree.unfreeze();
    });
    return result;
}

function init() {
    tree.root(1, makeSplit(0, data.length - 1));
}

async function main() {
    await sd.pause();
}
