import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let t = sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);

main();

async function main() {
    t.root(1);
    link(1, 2);
    link(1, 3);
    link(2, 4);
    link(3, 5);
    link(3, 6);
    link(4, 7);
    link(4, 8);
    link(4, 9);
    link(5, 10);
    link(8, 11);

    color([11, 8, 4, 2, 1, 3, 5, 10]);

}

function link(u, v) {
    t.newNode(v);
    t.newLink(u, v);
}

function color(arr) {
    for (let i = 1; i < arr.length; i++) {
        let u = arr[i - 1];
        let v = arr[i];
        if (u > v) { let tmp = u; u = v; v = tmp; }
        t.element(u, v).stroke(C.red).strokeWidth(2);
    }
}