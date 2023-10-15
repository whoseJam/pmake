import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let arr = sd.Array(svg).drag(true).resizeable(true);

push(-1, 5);
push(2, 3);
push(3, 4);
push(5, 2);
push(7, 4);
arr.cx(600).cy(300);

function push(v, n) {
    for (let i = 1; i <= n; i++)
        arr.push(v);
}
