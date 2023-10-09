import { Util, Anitype, Text, Array, Graph, Color } from "#lib/slide";

let svg = Util.svg();
let pause = Util.pause;
let pause_append = Util.pause_append;
let S = Anitype.start;
let A = Anitype.append;

const create_1d = (len) => {
    let ans = [];
    while(len) {
        ans.push(0);
        len--;
    } return ans;
}

const get_bin = (x) => {
    let ans = "1";
    while (x) {
        ans = ans + "0";
        x--;
    } return ans;
}

let x = 123;
let x_ = x;
let l = 0;
let bins = [];
let bin_str = "";
while (x) {
    if (x&1) {
        bins.push(get_bin(l));
        bin_str = "1" + bin_str;
    } else bin_str = "0" + bin_str;
    x >>= 1; l++;
}
let eq = "";
for (let i = 0; i < bins.length; i++) {
    eq = eq + bins[i];
    if (i !== bins.length - 1) eq = eq + " + ";
}

let hint = new Text(svg, String(x_) + " = " + bin_str + " = ");
let eq_ = new Text(svg, eq);
hint.x(30); hint.cy(250); hint.font_size(50);
eq_.x(30); eq_.cy(310); eq_.font_size(50);
eq_.opacity(0);
pause(() => {
    eq_.opacity(1, S);
})