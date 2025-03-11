/*

luogu P4901

### 一、动画主题
通过可视化、可交互的动画展示，呈现依据题目要求对班级学生进行排队形的完整过程，并最终展示每个班级排队形后指定行队伍的美观度计算结果。

### 二、动画场景设计
1. **初始场景**
    - 一个班级有 N 个学生需要排队。
2. **排队形过程展示**
    - 起始阶段，在下方展示区域创建一个水平队列。此队列使用 sd.Array 进行存储，队列中的每个元素对应一个代表学生的小矩形块。这些矩形块紧密排列，每个矩形块的中心位置清晰显示学生的学号，学号按照顺序从左至右依次排列。例如，对于一个有 10 名学生的班级，展示为 “1 2 3 4 5 6 7 8 9 10” 的矩形块队列。
    - 按照斐波那契数列规则选取学生。利用 SD 动画框架，将当前要选取的学生对应的矩形块颜色转变为红色（或其他醒目的颜色）以突出显示，同时使该矩形块进行几次闪烁动画，之后将其从原队列中通过平移操作移动到新的一行。新行位于上一行的正下方，且起始位置保持对齐。例如，对于 10 人的队列，逐个突出显示并平移 “1 2 3 5 8” 到新行，在移动过程中，sd.Array 中的相应元素也同步调整。
    - 剩余未选取的学生矩形块自动靠拢，形成新的队列，同时更新 sd.Array 以反映新的队列状态。持续进行下一轮选取，如此循环往复，直至队列中没有学生可被选取。在整个过程中，原队列的长度逐渐缩短，新行的数量和每行的人数逐步确定，且 sd.Array 始终准确记录队列状态。
3. **美观度结果展示**
    - 当每个班级的排队形操作结束后，在屏幕下方展示区域的底部创建结果面板。
    - 对于存在第 $K_i$ 行的班级，借助 SD.Text 组件在结果面板中展示第 $K_i$ 行的队伍（以学号数字形式呈现该行学生）以及该行对应的美观度数值。这里的队伍展示可以基于 sd.Array 中存储的对应行的数据进行呈现。
    - 对于不存在第 $K_i$ 行的班级，同样在结果面板中使用 SD.Text 展示 “-1”。

### 三、代码需求
1. **数据结构**
    - 使用 sd.Array 精确存储每行学生的学号信息，便于在动画过程中对学生的位置和状态进行准确跟踪和调整。
2. **函数**
    - 编写生成斐波那契数列的函数，该函数能够准确确定每次选取人员在队列中的位置，为后续的选取操作提供依据。
    - 实现从队列（sd.Array）中选取人员并生成新队列和新行的函数。此函数需正确处理 sd.Array 中元素的移除、添加和位置调整，保证数据与动画展示的一致性。
    - 编写计算一行美观度（分解质因子个数）的函数，确保计算逻辑准确无误，能够根据 sd.Array 中的学号数据计算出正确的美观度。

*/

import * as sd from "@/sd";

const N = 20; // 假设有10个学生
const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const rows = new sd.ValueStack(svg).elementHeight(60).align("x").x(100).y(100);

// 生成斐波那契数列的函数
function fibonacciSequence(n) {
    let fib = [1, 2];
    while (fib[fib.length - 1] <= n) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib.filter(num => num <= n);
}

// 计算一行美观度（分解质因子个数）的函数
function calculateBeauty(arr) {
    function countPrimeFactors(num) {
        let count = 0;
        for (let i = 2; i * i <= num; i++) {
            while (num % i === 0) {
                count++;
                num /= i;
            }
        }
        if (num > 1) count++;
        return count;
    }
    let totalBeauty = 0;
    arr.forEach(num => (totalBeauty += countPrimeFactors(num)));
    return totalBeauty;
}

// 从队列（sd.Array）中选取人员并生成新队列和新行的函数
async function selectAndReorderStudents(originalArray, newArray) {
    await sd.pause();
    const fibIndices = fibonacciSequence(originalArray.length());
    originalArray.startAnimate();
    for (const index of fibIndices) originalArray.color(index, C.red);
    originalArray.endAnimate();

    await sd.pause();
    originalArray.startAnimate();
    newArray.startAnimate();
    const elements = [];
    for (let i = originalArray.length(); i >= 1; i--) {
        if (originalArray.color(i).fill === C.white) {
            elements.push(originalArray.dropElement(i));
        }
    }
    for (let i = elements.length - 1; i >= 0; i--) newArray.pushFromExistElement(elements[i]);
    originalArray.endAnimate();
    newArray.endAnimate();

    await sd.pause();
    const rowNumbers = [];
    originalArray.forEachElement(element => rowNumbers.push(element.intValue()));
    const beauty = calculateBeauty(rowNumbers);
    sd.Label(originalArray, `美观度：${beauty}`, "lc").opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    originalArray.startAnimate().color(C.white).endAnimate();
}

sd.init(() => {
    const originalArray = new sd.Array(rows).start(1);
    rows.push(originalArray);
    for (let i = 1; i <= N; i++) {
        originalArray.push(i);
    }
});

sd.main(async () => {
    let count = 0;
    while (rows.lastElement().length() > 1) {
        rows.push(new sd.Array(rows).start(1));
        await selectAndReorderStudents(rows.element(count), rows.element(count + 1));
        count++;
    }
    if (rows.lastElement().length() >= 1) {
        await sd.pause();
        const rowNumbers = [];
        const lastArray = rows.lastElement();
        lastArray.forEachElement(element => rowNumbers.push(element.intValue()));
        const beauty = calculateBeauty(rowNumbers);
        sd.Label(lastArray, `美观度：${beauty}`, "lc").opacity(0).startAnimate().opacity(1).endAnimate();
    }
});
