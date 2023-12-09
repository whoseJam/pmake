import * as sd from "#lib/slide";

let svg = sd.svg();
let arr = sd.Array(svg);
sd.EnableArrayName(arr, "A");
let val = [-1, -1, 1, 1, 1, 1, 3, 10, 10, 10];
for (let i = 0; i < val.length; i++)
    arr.push(val[i]);
arr.start(1).indexed(true);
let sum = sd.Array(svg);
sd.EnableArrayName(sum, "Sum");
for (let l = 0, r; l < val.length; l = r + 1) {
    r = l;
    while (r + 1 < val.length && val[r+1] == val[l]) r++;
    for (let i = 1; i <= r - l + 1; i++) sum.push(r-l+1);
}
arr.x(100).y(100);
sum.x(100).y(140);