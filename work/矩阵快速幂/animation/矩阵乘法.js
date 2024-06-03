import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const data1 = [
    [1, 2, 3],
    [3, 2, 1]
];
const data2 = [
    [1, 1, 2, 2],
    [3, 3, 4, 4],
    [5, 5, 6, 6]
];
const matrix1 = new sd.Grid(svg);
const matrix2 = new sd.Grid(svg);
const matrix3 = new sd.Grid(svg);

init();
main();

function init() {
    function initMatrix(matrix, data) {
        matrix.n(data.length);
        matrix.m(data[0].length);
        for (let i = 0; i < data.length; i++)
            for (let j = 0; j < data[i].length; j++)
                matrix.value(i, j, data[i][j]);
    }
    initMatrix(matrix1, data1);
    initMatrix(matrix2, data2);
    matrix1.x(100).cy(300);
    matrix2.x(matrix1.mx() + 50).cy(300);
    matrix3.n(matrix1.n()).m(matrix2.m());
    matrix3.x(matrix2.mx() + 50).cy(300);
}

async function main() {
    const R1 = matrix1.n();
    const C1 = matrix1.m();
    const C2 = matrix2.m();
    for (let i = 0; i < R1; i++) {
        for (let j = 0; j < C2; j++) {
            await sd.pause();
            matrix1.startAnimate();
            matrix2.startAnimate();
            let ans = 0;
            for (let k = 0; k < C1; k++) {
                matrix1.color(i, k, C.blue);
                matrix2.color(k, j, C.blue);
                ans += data1[i][k] * data2[k][j];
            }
            matrix1.endAnimate();
            matrix2.endAnimate();
            matrix3.startAnimate().color(i, j, C.green).endAnimate();
            await sd.pause();
            matrix3.startAnimate().value(i, j, ans).endAnimate();
            await sd.pause();
            matrix1.startAnimate().color(C.white).endAnimate();
            matrix2.startAnimate().color(C.white).endAnimate();
            matrix3.startAnimate().color(C.white).endAnimate();
        }
    }
}