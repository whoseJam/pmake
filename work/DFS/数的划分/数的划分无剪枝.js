import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const k = 3;
const tree = new sd.ValueTree(svg).width(1000);
tree.dy(22);
let tot = 1;

sd.init(() => {
    tree.root(1, makeDivide([]));
})

sd.main(async() => {
})

function makeDivide(arr) {
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
    
    if (arr.length === k) {
        result.onClick(() => {
            result.color(Sum(arr) === n ? C.orange : C.red);
        });
        return result;
    }

    result.onClick(() => {
        result.onClick(() => {});
        tree.freeze();
        const mn = arr.length ? arr[arr.length - 1] : 1;
        for (let append = mn; append <= n; append++) {
           
            const arrNew = [...arr, append];
            tree.newNode(++tot, makeDivide(arrNew));
            tree.newLink(myId, tot);
            tree.element(myId, tot).arrow();
        }
        tree.unfreeze();
    });
    return result;
}

function Sum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++)
        sum += arr[i];
    return sum;
}