import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
// const dict = [
//     "dab",
//     "ba",
//     "ab",
//     "daa",
//     "aa",
//     "aaa",
//     "aab",
//     "abc",
//     "ac",
//     "dadba"
// ]
const dict = [
    "aaaba",
    "aa",
    "aaabb",
    "abaab",
    "aba",
    "ababb",
    "abbab"
];
const tree = new sd.Tree(svg).width(600);
const ch = sd.make2d(50, 26);
let tot = 1;

init();
main();

function init() {
    tree.root(1).freeze();
    dict.forEach(word => {
        let u = 1;
        for (let i = 0; i < word.length; i++) {
            const dir = word.charCodeAt(i) - 97;
            console.log("dir=", dir);
            if (!ch[u][dir]) {
                ch[u][dir] = ++tot;
                tree.newNode(tot);
                tree.link(u, tot);
                tree.element(u, tot).value(word[i], R.PointAtPathByRate(0.5, "x", "cy"));
            }
            u = ch[u][dir];
        }
        tree.element(u).stroke(C.red).strokeWidth(3);
    });
    tree.unfreeze();
}

async function main() {
    await sd.pause();
}