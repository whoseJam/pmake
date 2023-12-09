import * as sd from "#lib/slide";

let svg = sd.svg();
let arr = sd.Array(svg).drag(true).resizeable(true);
let str = "998244353";
let txt = sd.Text(svg, str).drag(true).resizeable(true);
for (let i = str.length - 1; i >= 0; i--)
    arr.push(str[i]);
arr.start(1).indexed(true);

async function main() {

}