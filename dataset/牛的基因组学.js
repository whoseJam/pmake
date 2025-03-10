/*

### 需求描述
1. **数据结构与存储**：
    - 有 2n 头奶牛，前 n 头为斑点奶牛，后 n 头为非斑点奶牛，每头奶牛基因是长度为 m 的字符串。用 `sd.ValueStack` 存放奶牛基因，每个基因用 `sd.Array` 表示。例如，若有 4 头奶牛（n = 2），基因长度为 3（m = 3），斑点奶牛基因分别为 "abc"、"def"，非斑点奶牛基因分别为 "ghi"、"jkl"，则可构建 `sd.ValueStack` 来存储这些基因数据。
2. **区间选择器实现**：
    - 使用 `sd.Button` 加上两个 `sd.Input` 实现区间选择器。两个 `sd.Input` 分别用于输入起始位置和结束位置，输入范围需限制在 [1, m] 之间（因为基因长度为 m）。`sd.Button` 用于触发区间选择操作，点击按钮后，验证输入的区间是否合法（起始位置不能大于结束位置，且都要在有效范围内）。
3. **基因涂色功能**：
    - 用户选定区间后，对每头奶牛在该区间内的基因进行涂色。具体来说，遍历 `sd.ValueStack` 中的每个 `sd.Array`（即每头奶牛的基因），提取出选定区间内的字符。例如，若选定区间为 [2, 3]，对于基因 "abc"，则提取出 "bc"。然后，为这些提取出的字符设置颜色，可以使用 `sd.color` 方法来指定颜色，比如红色 `C.red`（假设 `C` 为已引入的颜色工具，类似示例代码中的设置）。
4. **界面交互与动画效果**：
    - 当用户输入区间并点击按钮后，通过动画展示基因的涂色过程。可以使用 `startAnimate` 和 `endAnimate` 方法来实现动画效果。例如，先将未选定区间的基因颜色设置为默认颜色（如黑色），然后在动画过程中，逐渐将选定区间的基因颜色变为指定颜色（如红色）。
5. **错误处理与提示**：
    - 如果用户输入的区间不合法（如起始位置大于结束位置、超出基因长度范围等），给出相应的错误提示。可以使用 `sd.Text` 组件在界面上显示错误信息，如 "输入区间不合法，请重新输入"。
6. **代码结构与组织**：
    - 代码整体结构需参考示例代码的风格，逻辑清晰。在 `sd.init` 函数中进行初始化操作，如创建 `sd.ValueStack`、`sd.Button`、`sd.Input` 等组件，并设置它们的初始位置和属性。在 `sd.main` 函数中处理用户交互和动画逻辑，确保各个功能模块之间协同工作。

*/

import * as sd from "@/sd";
const C = sd.color();
const svg = sd.svg();
// 假设 n 和 m 已知，这里设置示例值
const n = 3;
const m = 8;
// 示例基因数据
const spottedCowsGenes = ["AATCCCAT", "ACTTGCAA", "GGTCGCAA"];
const nonSpottedCowsGenes = ["ACTCCCAG", "ACTCGCAT", "ACTTCCAT"];
const spotted = new sd.ValueStack(svg).x(100).y(100).align("x");
const nonSpotted = new sd.ValueStack(svg).x(100).y(100).align("x");
const startInput = new sd.Input(svg);
const endInput = new sd.Input(svg);
const button = new sd.Button(svg);

sd.init(() => {
    // 填充斑点奶牛基因
    spottedCowsGenes.forEach(gene => {
        const arr = new sd.Array(svg).pushArray(gene);
        spotted.push(arr);
    });
    // 填充非斑点奶牛基因
    nonSpottedCowsGenes.forEach(gene => {
        const arr = new sd.Array(svg).pushArray(gene);
        nonSpotted.push(arr);
    });
    nonSpotted.y(spotted.my() + 20);
    startInput.x(nonSpotted.x()).y(nonSpotted.my() + 20);
    endInput.x(nonSpotted.x()).y(startInput.my() + 20);
    button.x(nonSpotted.x()).y(endInput.my() + 20);
    // sd.Label(startInput, "左端点", "rc");
    // sd.Label(endInput, "右端点", "rc");

    button.onClick(() => {
        const start = parseInt(startInput.value());
        const end = parseInt(endInput.value());
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > m) return;
        sd.inter(async () => {
            // 先对选定区间进行涂色
            spotted.forEachElement(arr => {
                for (let i = start - 1; i < end; i++) {
                    arr.element(i).startAnimate().color(C.red).endAnimate();
                }
            });
            nonSpotted.forEachElement(arr => {
                for (let i = start - 1; i < end; i++) {
                    arr.element(i).startAnimate().color(C.red).endAnimate();
                }
            });
            await sd.pause();
            // 再将所有基因设置为默认颜色
            spotted.forEachElement(arr => {
                arr.startAnimate().color(C.white).endAnimate();
            });
            nonSpotted.forEachElement(arr => {
                arr.startAnimate().color(C.white).endAnimate();
            });
        });
    });
});

sd.main(async () => {});
