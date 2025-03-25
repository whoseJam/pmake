/*

luogu P3667

### 需求文档

#### 初始化阶段：
1. **获取SVG画布作为渲染区域：**
   - 使用 `sd.svg()` 函数获取SVG画布。
    
2. **初始化两组牛的基因组字符串列表展示：**
   - 声明两个数组 `spottedCows` 和 `plainCows` 分别存储斑点牛和普通牛的基因组字符串序列。这里每个字符串代表一头牛的基因序列。由于用户已经给出了一个具体的样例数据，我们使用该数据：
   - 使用 `sd.Array` 来表示每个牛的基因组字符串。 `sd.Array` 的每个元素代表一个基因字符。

3. **创建高亮当前检查的子串区间的矩形边框：**
   - 初始化透明边框的 `sd.Rect` 组件，一个用于斑点牛的基因组数组中，一个用于普通牛的基因组数组中，边框颜色为 `sd.color().yellow`。

4. **创建输入框和按钮组件用于交互：**
   - 使用 `sd.Input` 组件来让用户输入区间的起始位置 `start` 和终止位置 `end`。
   - 使用 `sd.Button` 组件让用户点击，高亮输入的区间，并验证是否能唯一区分斑点牛和普通牛的基因组序列。

#### 主要动画阶段：
无。

#### 交互式设计：
1. **用户输入区间：**
   - 设置两个 `sd.Input` 组件，一个用于输入区间起始位置，另一个用于输入区间结束位置。
   - 使用一个 `sd.Button` 组件，让用户点击“验证”按钮后，高亮所有奶牛的这段区间的基因。

#### 布局设计：
1. **基因组字符串列表：**
   - 斑点牛的基因组数组 `spottedCows` 放在画布的上部分。
   - 普通牛的基因组数组 `plainCows` 放在画布的下部分。
   - 每个数组中的基因组字符串由 `sd.Array` 组件绘制，通过垂直排列展示各个基因组字符串。

2. **高亮矩形框：**
   - 设置透明边框的 `sd.Rect` 来高亮斑点牛和普通牛当前的检查区间，使其填充颜色为黄色。

3. **用户交互组件布局：**
   - 输入框和按钮组件可以放置在画布顶部或底部区域。
   - 验证结果提示信息可以显示在画布底部区域。

*/

/*
评价：
计算逻辑正确，动画逻辑正确。
*/

import * as sd from "@/sd";

const svg = sd.svg(); // 获取 SVG 画布
const C = sd.color();
const btnWidth = 100;
const btnHeight = 30;
const geneWidth = 20;
const geneHeight = 30;
const fontSize = 12;
const inputWidth = 100;
const inputHeight = 30;

// 输入的基因组数据
const spottedCows = ["AATCCCAT", "ACTTGCAA", "GGTCGCAA"];
const plainCows = ["ACTCCCAG", "ACTCGCAT", "ACTTCCAT"];
const N = spottedCows.length; // 斑点牛的数量
const M = spottedCows[0].length; // 第1个斑点牛基因组的长度，假设所有基因组长度相同

// 初始化两个数组用于存储基因组字符串，每个字符作为一个独立的元素放入数组中
const spottedArrays = [];
const plainArrays = [];
for (let i = 0; i < N; i++) {
    spottedArrays.push(
        new sd.Array(svg)
            .x(50)
            .y(150 + i * geneHeight)
            .start(1)
    );
    for (let j = 0; j < M; j++) {
        spottedArrays[i].push(new sd.Text(svg, spottedCows[i][j]).fontSize(fontSize).fill(C.black));
    }
}

for (let i = 0; i < N; i++) {
    plainArrays.push(
        new sd.Array(svg)
            .x(50)
            .y(350 + i * geneHeight)
            .start(1)
    );
    for (let j = 0; j < M; j++) {
        plainArrays[i].push(new sd.Text(svg, plainCows[i][j]).fontSize(fontSize).fill(C.black));
    }
}

// 创建高亮当前检查子串区间的矩形边框
let highlightedRectsSpotted = new Array(N).fill(null);
let highlightedRectsPlain = new Array(N).fill(null);

let verifyBtn = new sd.Button(sd.div()).onClick(() => {
    sd.inter(async () => {
        let start = Number(startInput.value()) - 1; // 区间起始下标（已转换为0-based）, 并确保不小于0
        let end = Number(endInput.value()); // 区间结束下标（已转换为1-based），并确保不大于M

        if (start < 0 || end > M || start >= end) {
            let resultText = new sd.Text(svg, "无效的起始或结束位置，请重新输入。").x(50).y(600).fontSize(fontSize).fill(C.red);
            appear(resultText);
            await sd.pause(3000);
            resultText.erase();
            return;
        }

        let startPos = Math.max(0, start);
        let endPos = Math.min(M, end);

        for (let i = 0; i < N; i++) {
            if (highlightedRectsSpotted[i]) {
                highlightedRectsSpotted[i].erase();
                highlightedRectsSpotted[i] = null;
            }
            if (highlightedRectsPlain[i]) {
                highlightedRectsPlain[i].erase();
                highlightedRectsPlain[i] = null;
            }
        }

        for (let i = 0; i < N; i++) {
            // 初始化起点和终点元素，并计算其中心位置
            let startElement = spottedArrays[i].element(startPos);
            let endElement = spottedArrays[i].element(endPos - 1);

            if (!startElement || !endElement) continue;

            let startCenter = startElement.center();
            let endCenter = endElement.center();

            let centerX = (startCenter[0] + endCenter[0]) / 2;
            let centerY = startCenter[1];

            highlightedRectsSpotted[i] = new sd.Rect(svg)
                .strokeWidth(1)
                .fillOpacity(0)
                .stroke(C.orange)
                .strokeWidth(1)
                .center(centerX - 20, centerY)
                .width((endPos - startPos) * startElement.width())
                .height(startElement.height());

            // 同样处理普通牛的基因组
            startElement = plainArrays[i].element(startPos);
            endElement = plainArrays[i].element(endPos - 1);

            if (!startElement || !endElement) continue;

            startCenter = startElement.center();
            endCenter = endElement.center();

            centerX = (startCenter[0] + endCenter[0]) / 2;
            centerY = startCenter[1];

            highlightedRectsPlain[i] = new sd.Rect(svg)
                .strokeWidth(1)
                .fillOpacity(0)
                .stroke(C.orange)
                .strokeWidth(1)
                .center(centerX - 20, centerY)
                .width((endPos - startPos) * startElement.width())
                .height(startElement.height());
        }

        const spottedSubstrings = spottedCows.map(cow => cow.slice(startPos, endPos));
        const plainSubstrings = plainCows.map(cow => cow.slice(startPos, endPos));
        const spottedSet = new Set(spottedSubstrings);
        let canDistinguish = true;
        for (let sub of plainSubstrings) {
            if (spottedSet.has(sub)) {
                canDistinguish = false;
                break;
            }
        }

        let resultMsg = "";
        if (canDistinguish) {
            resultMsg = `位置区间 [${start + 1}, ${end}]的长度为 ${end - start}，可以区分斑点牛和普通牛。`;
        } else {
            resultMsg = `位置区间 [${start + 1}, ${end}]的长度为 ${end - start}，不能区分斑点牛和普通牛。`;
        }

        let resultText = new sd.Text(svg, resultMsg).x(500).y(100).fontSize(fontSize);
        appear(resultText);
        await sd.pause();
        resultText.remove();
    });
});

verifyBtn.text("验证区间").x(350).y(50).width(btnWidth).height(btnHeight);

let startInput = new sd.Input(sd.div())
    .label("起始位置：")
    .value(2) // 默认值可以设为2
    .width(inputWidth)
    .height(inputHeight)
    .x(50)
    .y(50);

let endInput = new sd.Input(sd.div())
    .label("结束位置：")
    .value(5) // 默认值可以设为5
    .width(inputWidth)
    .height(inputHeight)
    .x(200)
    .y(50);

sd.init(() => {
    new sd.Text(svg, "斑点牛基因组序列：").x(50).y(100);
    new sd.Text(svg, "普通牛基因组序列：").x(50).y(300);
});

function appear(element) {
    element.opacity(0);
    element.startAnimate().opacity(1).endAnimate();
}

sd.main(() => {});
