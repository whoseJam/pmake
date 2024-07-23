import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();

最长公共子序列状态转移();

function 最长公共子序列状态转移() {
    let X = new sd.Array(svg).x(100).y(100);
    let Y = new sd.Array(svg).x(100).y(180);
    X.resize(10);
    Y.resize(10);
    let px = sd.Pointer(X, "i", "b").moveTo(7);
    let py = sd.Pointer(Y, "j", "t").moveTo(8);
    sd.Label(X, "X");
    sd.Label(Y, "Y");
    X.value(7, "a");
    Y.value(8, "a");
    return;
    let pairs = [
        [1, 0], [2, 2], [5, 3], [7, 6]];
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        X.color(pair[0], C.green);
        Y.color(pair[1], C.green);
        let l = new sd.Line(svg);
        let x = X.element(pair[0]);
        let y = Y.element(pair[1]);
        l.source(x.cx(), x.cy()).target(y.cx(), y.cy());
        sd.trim(l, x, y);
    }
}

function 最长公共子序列() {
    let X = new sd.Array(svg).x(100).y(100);
    let Y = new sd.Array(svg).x(100).y(180);
    let strX = "ABCBDAB", strY = "BDCABA";
    sd.Label(X, "X");
    sd.Label(Y, "Y");
    let pairs = [
        [1, 0], [2, 2], [3, 4], [5, 5]];
    for (let i = 0; i < strX.length; i++)
        X.push(strX[i]);
    for (let i = 0; i < strY.length; i++)
        Y.push(strY[i]);
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        X.color(pair[0], C.green);
        Y.color(pair[1], C.green);
        let l = new sd.Line(svg);
        let x = X.element(pair[0]);
        let y = Y.element(pair[1]);
        l.source(x.cx(), x.cy()).target(y.cx(), y.cy());
        sd.trim(l, x, y);
    }
}