import * as sd from "#lib/slide";

let svg = sd.svg();
let arr = sd.Array(svg).x(200).y(100).start(1);
let nxt = sd.Array(svg).x(200).y(200).start(1);
let str = " abaabaababab"
let len = str.length - 1;
let nxtv = sd.make1d(100, 0);
for (let i = 1; i <= len; i++)
    arr.push(str[i]);
nxt.resize(len);
sd.EnableArrayName(nxt, "nxt数组")
sd.EnableArrayName(arr, "原字符串")

main();

function prepare() {
    nxtv[0] = nxtv[1] = 0; let cur = 0;
    for (let i = 2; i <= len; i++) {
        while (cur && str[cur+1] !== str[i])
            cur = nxtv[cur];
        if (str[cur + 1] === str[i]) cur++;
        nxtv[i] = cur;
    }
    for (let i = 1; i <= len; i++)
        nxt.value(i, nxtv[i]);
}

function main() {
    prepare();

}