import * as sd from "@/sd";

const svg = sd.svg();
const n = 7;
const tree = new sd.ValueTree(svg).width(1000);
const UNIQUE = true;
const ASCEND = true;
tree.cx(600).y(50);
let tot = 1;

init();
main();

function makeSplit(arr) {
    let result;
    const myId = tot;
    const array = new sd.Array(tree).elementWidth(20).elementHeight(20);
    for (let i = 0; i < arr.length; i++)
        array.push(arr[i]);
    result = array;
    
    result.onClick(() => {
        result.onClick(() => {});
        const lim = arr.length ? arr[arr.length - 1] : n;
        tree.freeze();
        const uset = UNIQUE ? [...new Set(arr)] : arr;
        for (let i = 0; i < uset.length; i++) {
            for (let j = i; j < uset.length; j++) {
                const v = uset[i] + uset[j];
                if (v > n) break;
                if (v < arr[arr.length - 1] && ASCEND) continue;
                const newArr = [...arr, v];
                tree.newNode(++tot, makeSplit(newArr));
                tree.newLink(myId, tot);
            }
        }
        tree.unfreeze();
    });
    return result;
}

function init() {
    tree.root(1, makeSplit([1]));
}

async function main() {
    await sd.pause();
}
