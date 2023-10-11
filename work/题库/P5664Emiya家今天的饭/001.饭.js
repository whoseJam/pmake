import * as sd from "#lib/slide";

let svg = sd.svg();
let R = sd.reader();
let n = 6, m = 3;
let data = R.readIntMatrix(`1 2 3 4 5 0 6 0 0 1 2 3 4 5 0 6 0 0`, n, m);
let source = sd.Array(svg);
let cook = sd.Stack(svg);
sd.EnableArrayName(source, "食材", 20);
sd.EnableTitle(cook, "烹饪方法", 20);
for (let i = 1; i <= n; i++)
    cook.push(i);
for (let j = 1; j <= m; j++)
    source.push(j);
cook.x(310).y(150);
source.x(460).y(60);
let grid = sd.Grid(svg);
grid.n(n).m(m).startN(1).startM(1).x(460).y(150);
for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
        grid.value(i, j, sd.Text(grid, data[i][j]));

main();

async function main() {
    await sd.pause();
    addMath("Ans=\\sum_{做饭方案w}[每种食材至多在一半的菜中出现]");
    await sd.pause();
    addMath("Ans=\\sum_{做饭方案w}1-\\sum_{做饭方案}[存在一种食材出现了超过\\lfloor\\frac k 2\\rfloor次]", 60);
    await sd.pause();
    addMath("Rev=\\sum_{食材i}\\sum_{做饭方案}[食材i在做饭方案w中出现了超过\\lfloor\\frac k 2\\rfloor次]", 60);
    await sd.pause();
    addMath("枚举食材f，计算强制让f出现超过\\lfloor\\frac k 2\\rfloor次的方案数");
    await sd.pause();
    addMath("设dp(i,j)表示，考虑到第i行，f出现了j次的做饭方案数", 25);
    await sd.pause();
    addMath("dp(i,j)=(\\sum_{k\\ne f}dp(i-1,j)\\cdot a_{i,k})+dp(i-1,j-1)\\cdot a_{i,f}");
}

let x = 600, y = 50;
function addMath(str, height = 50) {
    let math = sd.Mathjax(svg);
    math.x(x).y(y).height(height);
    math.math(str);
    y += math.height() + 10;
    return math;
}
