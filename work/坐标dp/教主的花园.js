// import * as sd from "../@/SD";

// let svg = sd.svg();
// let C = sd.color();
// let I = sd.input();
// let d = makeDp();

// main();

// async function main() {
//     await sd.pause();
//     await d.dp();
// }

// function makeDp() {
//     let self = {};
//     let n = 4, m = 3;
//     let mp = makeGrid(svg, n, m);
//     let dp = makeGrid(svg, n, m);
//     let math = sd.Stress(new sd.Mathjax(svg, "f(i,j)=\\mathop{max}_{k\\ne j}\\{f(i-1,k)\\}+a(i,j)").height(30).cx(600).cy(400));
//     let data = I.readIntMatrix(`
//     1 3 2
//     3 1 2
//     3 1 2
//     3 1 2
//     `, 4, 3, true);
//     for (let i = 1; i <= n; i++)
//         for (let j = 1; j <= m; j++)
//             mp.value(i, j, data[i][j]);
//     mp.x(300).y(100);
//     dp.x(700).y(100);
//     // mp.color(1, 2, C.green);
//     // mp.color(2, 1, C.green);
//     // mp.color(3, 3, C.green);
//     // mp.color(4, 1, C.green);
//     self.dp = async function() {
//         for (let j = 1; j <= m; j++) {
//             await sd.pause();
//             dp.startAnimate().color(1, j, C.orange).endAnimate();
//             mp.startAnimate().color(1, j, C.blue).endAnimate();
//             await sd.pause();
//             dp.startAnimate().value(1, j, data[1][j]).endAnimate();
//             await sd.pause();
//             dp.startAnimate().color(C.white).endAnimate();
//             mp.startAnimate().color(C.white).endAnimate();
//         }
//         for (let i = 2; i <= n; i++) {
//             for (let j = 1; j <= m; j++) {
//                 await sd.pause();
//                 dp.startAnimate();
//                 dp.color(i, j, C.orange);
//                 let ans = 0;
//                 for (let k = 1; k <= m; k++) {
//                     if (k === j) continue;
//                     dp.color(i-1, k, C.blue);
//                     ans = Math.max(ans, dp.intValue(i-1, k));
//                 }
//                 dp.endAnimate();
//                 mp.startAnimate().color(i, j, C.blue).endAnimate();

//                 await sd.pause();
//                 math.startAnimate().stress().endAnimate();
//                 await sd.pause();
//                 dp.startAnimate().value(i, j, ans + data[i][j]).endAnimate();
//                 await sd.pause();
//                 dp.startAnimate().color(C.white).endAnimate();
//                 mp.startAnimate().color(C.white).endAnimate();
//             }
//         }
//         await sd.pause();
//     }
//     function makeGrid(svg, n, m) { return new sd.Grid(svg).startN(1).startM(1).n(n).m(m); }
//     return self;
// }