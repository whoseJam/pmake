/*

luogu P4901

## 需求文档

### 初始化阶段：
1. 初始化一个场景，用于展示一个班级的学生队列及其排列情况。
   - 使用 `sd.Text` 组件表示每个学生，文本内容为学生的学号（例如 `sd.Text(svg, "1")`、`sd.Text(svg, "2")` 等）。
   - 初始化一个一维数组表示初始的学生队列，将学生按学号顺序从一个初始位置排列。
   - 使用 `sd.Array` 组件来存储每一行的学生。每行代表一个 `sd.Array` 对象，学生通过斐波那契数列规则被分配到不同的行。

### 主要动画阶段：
1. **按照斐波那契数列顺序（1, 2, 3, 5, 8, 13, ...）取出学生并组成新的行：**
   - 使用斐波那契数列确定要提取的学生的位置索引。
   - 将被选中的学生（`sd.Text` 组件）从原队列中“移动”到新的一行 `sd.Array` 中，直到原队列中没有学生为止。
   - 对于每一次“取走”操作，可以通过动画展示学生被选中并移动到新行的过程。
2. **计算每一行的美观度：**
   - 提取每一行中学号乘积，并计算乘积的质因子个数。
   - 使用 `sd.Text` 组件在每一行下方显示相应的美观度计算结果。

### 交互式设计：
1. 由于题目没有特别要求交互元素，此处可以省略交互式设计。如果有必要增加交互，可以设置按钮继续展示接下来的排列过程，但是通常需求描述中没有体现交互。

### 布局设计：
1. 初始队列可以水平排列在画布上半部分，各 `sd.Text` 组件按学号顺序并排。
2. 新生成的行排列在初始队列下方，每行的 `sd.Array` 组件依次垂直排开。
3. 在每一行下使用 `sd.Text` 组件显示该行的美观度。

*/

/*
评价：
计算逻辑没问题，动画逻辑就没动画。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const n = 10; // 假设班级人数为10
const k = 2; // 假设要求的是第2行的美观度

// 构建斐波那契数列，直到超过总数n
let fib = [1, 2];
while (fib[fib.length - 1] + fib[fib.length - 2] <= n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
}

// 初始化一个数组表示学生学号
let students = [];
for (let i = 1; i <= n; i++) {
    students.push(i);
}

// 创建一个二维数组用于存储最终的每行学生编号
let lines = [];
while (students.length > 0) {
    const newLine = [];
    let nextStudents = [];
    for (let i = 0, j = 0; i < students.length; i++) {
        if (i + 1 === fib[j]) {
            newLine.push(students[i]); // 被选中的学生
            j++;
        } else {
            nextStudents.push(students[i]); // 未被选中的学生留在原数组
        }
    }
    lines.push(newLine);
    students = nextStudents;
}

// 打印每行的学生队列和所求行数是否存在检查
if (k > lines.length) {
    console.log(-1);
} else {
    // 计算第k-1行（数组从0开始，所以是k-1行）的美观度
    let product = lines[k - 1].reduce((acc, student) => acc * student, 1);
    let primeFactors = 0;
    for (let i = 2; i <= product; i++) {
        while (product % i === 0) {
            primeFactors++;
            product /= i;
        }
    }
    console.log("美观度:", primeFactors);
}

// 渲染每一行的学生
const R = sd.rule;
const fontSize = 20; // 字体大小
const lineHeight = 30; // 行高
const cellWidth = 25; // 单元格宽度
const lineSpacing = 40; // 行间距

let y = 50;
lines.forEach((line, lineIndex) => {
    // 创建一个 sd.Array 对象来表示一行学生
    const lineArray = new sd.Array(svg).resize(line.length).dx(50).dy(y);

    line.forEach((student, index) => {
        const studentText = new sd.Text(svg, student.toString()).fontSize(fontSize);
        lineArray.value(index, studentText);
    });

    // 在行下方显示美观度计算
    const product = line.reduce((acc, student) => acc * student, 1);
    let primeFactors = 0;
    let productCopy = product;
    for (let i = 2; i <= productCopy; i++) {
        while (productCopy % i === 0) {
            primeFactors++;
            productCopy /= i;
        }
    }

    if (lineIndex === k - 1) {
        const beautyText = new sd.Text(svg, `第${k}行的美观度：${primeFactors}`).center(200, y + lineHeight + 10).fontSize(fontSize);
    }

    y += lineHeight + lineSpacing;
});

sd.main(async () => {});
