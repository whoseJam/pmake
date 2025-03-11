/*

luogu P3211

### 需求描述
1. **图绘制需求**
    - 使用 SD 动画框架绘制一个无向连通图，节点编号从 1 到 N（N 可自定义），节点用圆形表示，边用线条连接。
    - 在每条边上显示该边的非负整数权值。
    - 你可以用 sd.GridGraph 生成可控的图。
2. **随机路径生成需求**
    - 从 1 号节点开始，以相等的概率随机选择与当前节点相关联的某条边，让一个动点沿此边移动到下一个节点，直到动点到达 n 号节点。
    - 你可以用 sd.Focus 来表示动点。
3. **XOR 和计算与显示需求**
    - 在动点移动过程中，实时计算当前路径上经过边的权值的“XOR 和”。
    - 可以在动画界面的某个位置实时显示当前路径的“XOR 和”数值。
4. **期望值计算与显示需求**
    - 支持多次运行随机路径生成过程，每次生成路径计算其“XOR 和”。
    - 计算所有这些路径“XOR 和”的期望值，并在动画界面上显示最终的期望值。
    - 每次运行完成后，应该清除这次动画生成的轨迹和“XOR 和”显示。
5. **整体交互需求**
    - 提供一个开始动画的交互操作（例如点击某个按钮或者通过代码执行初始化操作后等待用户按某个键开始）。
    - 在动画进行过程中，生成的路径线条（动点移动轨迹）要有别于图的原始边线条，例如用红色线条表示路径。 

*/

import * as sd from "@/sd";

// 自定义节点数量
const n = 4;

// 创建 svg 画布
const svg = sd.svg();
const C = sd.color();

// 生成图
const graph = new sd.GridGraph(svg).x(100).y(200).height(100).width(180);
// 表示动点
const focus = sd.Focus(graph);
// 存储所有路径的 XOR 和
const xorSums = [];

// 实时显示 XOR 和
const xorSumText = new sd.Mathjax(svg, "XOR 和: 0");

// 显示概率
const posssibilityText = new sd.Mathjax(svg, "概率: \\frac{1}{1}");
const button = new sd.Button(svg).text("开始");

sd.init(() => {
    graph.at(0.5, 0).newNode(1);
    graph.at(0, 0.5).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0.5, 1).newNode(4);
    graph.link(1, 2, 1).link(1, 3, 3).link(2, 3, 2).link(2, 4, 4).link(3, 4, 1);

    button.onClick(() => {
        sd.inter(async () => {
            await randomWalk();
        });
    });
    button.x(graph.x() - 20).my(graph.y() - 10);
    xorSumText.x(graph.x() - 20).my(button.y() - 10);
    posssibilityText.x(graph.x() - 20).my(xorSumText.y() - 10);
});

sd.main(async () => {});

async function randomWalk() {
    let currentNode = graph.element(1);
    let xorSum = 0;
    focus.startAnimate().focus(1).endAnimate();
    while (graph.nodeId(currentNode) !== String(n)) {
        const nextLinks = graph.outLinks(currentNode, "undirect");
        const nextLink = nextLinks[Math.floor(Math.random() * nextLinks.length)];
        const nextNode = graph.toNode(nextLink, currentNode);

        await sd.pause();
        // 绘制动点移动轨迹（红色线条）
        const line = new sd.Line(svg).strokeWidth(2);
        if (graph.sourceId(nextLink) === graph.nodeId(currentNode)) {
            line.source(nextLink.source());
            line.target(nextLink.target());
        } else {
            line.source(nextLink.target());
            line.target(nextLink.source());
        }
        line.color(C.red);
        line.startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        focus.startAnimate().focus(nextNode).endAnimate();
        await sd.pause();
        line.startAnimate().fadeStoT().endAnimate().remove();

        xorSum ^= nextLink.intValue();
        xorSumText.startAnimate().transformMath(`XOR 和: ${xorSum}`).endAnimate();
        posssibilityText
            .startAnimate()
            .transformMath(posssibilityText.math() + `\\frac{1}{${nextLinks.length}}`)
            .endAnimate();
        currentNode = nextNode;
    }

    await sd.pause();
    // 清除这次动画生成的轨迹
    focus.startAnimate().focus(null).endAnimate();
    xorSumText.startAnimate().transformMath("XOR 和: 0").endAnimate();
    posssibilityText.startAnimate().transformMath("概率: \\frac{1}{1}").endAnimate();
}
