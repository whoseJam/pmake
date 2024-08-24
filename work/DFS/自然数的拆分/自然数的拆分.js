import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const tree = new sd.ValueTree(svg).width(1000);
tree.dy(22);
let tot = 1;

init();
main();

function Sum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++)
        sum += arr[i];
    return sum;
}

function makeSplit(arr) {
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
        if (Sum(arr) === n) result.color(C.green);
        result.onClick(() => {});
        const lim = arr.length ? arr[arr.length - 1] : 1;
        let childCount = 0;
        tree.freeze();
        for (let append = lim; append <= n; append++) {
            const arrNew = [...arr, append];
            if (Sum(arrNew) > n) break;
            childCount++;
            tree.newNode(++tot, makeSplit(arrNew));
            tree.newLink(myId, tot);
        }
        tree.unfreeze();
        if (Sum(arr) !== n && childCount === 0) result.color(C.red);
    });
    return result;
}

function init() {
    tree.root(1, makeSplit([]));
}

async function main() {
    await sd.pause();
}
