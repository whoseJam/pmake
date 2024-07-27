import * as sd from "@/sd";

let svg = sd.svg();
let t = sd.BinaryTree(svg);
let values = [4, 3, 6, 2, 6, 1, 3, 7, 4];

main();

async function main() {
    t.root(4);
    await sd.pause();
    
}