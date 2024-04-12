import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = new sd.BarArray(svg).x(100).y(400);
let data = [2, 4, 2, 6, 4];
arr.push(2);
console.log(arr.x(), arr.y());
global.t = {
    h: async function() {
        await sd.pause();
        arr.startAnimate().push(6).color(arr.end(), C.BLUE).endAnimate();
        await sd.pause();
        console.log(arr.x(), arr.y());
    },
    m: async function() {
        await sd.pause();
        arr.startAnimate().push(4).color(arr.end(), C.BLUE).endAnimate();
        await sd.pause();
    },
    l: async function() {
        await sd.pause();
        arr.startAnimate().push(2).color(arr.end(), C.BLUE).endAnimate();
        await sd.pause();
    }
}

global.help = function() {
    return `
此场景中存在一个t对象
t.h(): 种一棵高树
t.m(): 种一棵中等高度树
t.l(): 种一棵低树`;
}