/*

luogu P3211

**需求文档**

#### 初始化阶段：
1. **画布准备：**
   - 使用 `sd.svg` 创建SVG画布。
   - 使用 `sd.TinyGraph` 创建图结构，并在每个节点的中心位置使用 `sd.Text` 显示节点编号。
   - 连接节点的边将使用 `sd.Line` 绘制，并在每条边的中心位置使用 `sd.Text` 显示边权值。
   - 使用一个 `sd.Focus` 组件，初始位置在节点1，表示当前访问的节点。

2. **文本组件初始化：**
   - 在画布顶部位置，使用以下 `sd.Text` 组件：
       - 一个 `sd.Text` 组件来显示“当前概率：1.000”。
       - 一个 `sd.Text` 组件来显示“当前路径异或和：0”。
   - 添加一个 `sd.Button`，按钮内容描述为“采样”。

#### 主要动画阶段：
1. **随机采样路径：**
   - 当用户点击“采样”按钮时，将 `sd.Focus` 组件重置至节点1，并将“当前概率”重置为1.000，将“当前路径异或和”重置为0，将“当前路径节点序列”重置为“1”。
   - 从当前节点（从节点1开始）随机均匀地选择一条相邻边，将 `sd.Focus` 组件动画过渡到所选择的相邻节点，并重复此过程，直到 `sd.Focus` 到达节点N：
       - 更新“当前概率”值，将其乘以1除以当前节点出度数。
       - 更新“当前路径异或和”值，将其与所选边的权值异或。
   - 当 `sd.Focus` 到达节点N时，动画暂停，突出显示得到的路径结果，显示当前路径的总概率和总异或和。

#### 交互式设计：
1. **按钮交互：**
   - 用户每次点击“采样”按钮，触发新的一轮随机路径采样过程，重新初始化 `sd.Focus` 的位置和文本组件信息。

#### 布局设计：
1. **节点分布：**
   - 利用 `sd.TinyGraph` 的力导向布局来均匀分布节点，减少边交叉。
2. **结果展示位置：**
   - 将展示“当前概率”、“当前路径异或和”和“当前路径节点序列”的 `sd.Text` 组件放在画布的左上角，确保清晰可见。按钮“采样”可 以放在画布右下角或合适位置。
   - `sd.Focus` 随着当前访问节点的变化而移动。

*/

/*
对 sd.Graph 理解过于不到位，没有可用性。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const N = 2;
const M = 2;
const edges = [
    { u: 1, v: 1, w: 2 },
    { u: 1, v: 2, w: 3 },
];

const adjs = Array.from({ length: N + 1 }, () => []);
edges.forEach(edge => {
    adjs[edge.u].push(edge.v);
    if (edge.u !== edge.v) adjs[edge.v].push(edge.u);
});

const graph = new sd.TinyGraph(svg);
for (let i = 1; i <= N; i++) graph.newNode(i);
edges.forEach(edge => {
    graph.link(edge[0], edge[1]);
});

let randomWalkEdges = [];

const focus = sd.Focus(graph);
const currentProbabilityText = new sd.Text(svg).text("当前概率：1.000").x(50).y(30);
const currentXorSumText = new sd.Text(svg).text("当前路径异或和：0").x(50).y(60);
const currentPathNodesText = new sd.Text(svg).text("当前路径节点序列：1").x(50).y(90);

const buttonDiv = sd.div();
const sampleButton = new sd.Button(buttonDiv);

sampleButton
    .text("开始一次采样")
    .cx(100)
    .cy(50)
    .onClick(() => {
        sd.inter(async () => {
            sampleButton.text("下一次采样");
            focus.focus(1);

            let currentNode = 1;
            let currentProbability = 1.0;
            let currentXorSum = 0;
            let currentPathNodes = [1];
            randomWalkEdges.length = 0;

            currentProbabilityText.content = "当前概率：1.000";
            currentXorSumText.content = "当前路径异或和：0";
            currentPathNodesText.content = "当前路径节点序列：1";

            while (currentNode !== N) {
                const edges = graph.outLinks(currentNode);
                const nextNodeIndex = Math.floor(Math.random() * edges.length);
                const { to, key, line, _object } = edges[nextNodeIndex];

                const edgeLine = graph.getLine(key).line;
                randomWalkEdges.push(edgeLine);
                edgeLine.startAnimate().color(C.red).endAnimate();

                const nextNode = to;

                await sd.pause();
                focus.startAnimate().focus(nextNode).endAnimate();

                currentNode = nextNode;
                currentProbability /= edges.length;
                const edge = edges.find(e => (e.u === currentNode && e.v === _object[0]) || (e.v === currentNode && e.u === _object[0]));
                currentXorSum ^= edge.w;
                currentPathNodes.push(currentNode);

                currentProbabilityText.content = `当前概率：${Math.round(currentProbability * 1000) / 1000}`;
                currentXorSumText.content = `当前路径异或和：${currentXorSum}`;
                currentPathNodesText.content = `当前路径节点序列：${currentPathNodes.join(" -> ")}`;
                await sd.pause();
            }

            for (let edgeLine of randomWalkEdges) {
                edgeLine.startAnimate().color(C.black).endAnimate();
            }
            randomWalkEdges.length = 0;
        });
    });

graph.scale(1.5);

sd.main(async () => {
    await sd.pause();
});
