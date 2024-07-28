import * as sd from "@/sd";

const svg = sd.svg();
const n = 4;
const tree = new sd.ValueTree(svg).width(1000);
tree.cx(600).y(50);
let tot = 1;

init();
main();

function makePermutation(arr) {
    let result;
    const myId = tot;
    if (arr.length == 0) {
        result = new sd.Text(tree, "空数组");
    } else {
        const array = new sd.Array(tree).elementWidth(20).elementHeight(20);
        for (let i = 0; i < arr.length; i++)
            array.push(arr[i]);
        result = array;
    }
    
    result.onClick(() => {
        result.onClick(() => {});
        const curSet = new Set(arr);
        tree.freeze();
        for (let append = 1; append <= n; append++) {
            if (curSet.has(append)) continue;
            const arrNew = [...arr, append];
            tree.newNode(++tot, makePermutation(arrNew));
            tree.newLink(myId, tot);
        }
        tree.unfreeze();
    });
    return result;
}

function init() {
    tree.root(1, makePermutation([]));
}

async function main() {
    await sd.pause();
}
