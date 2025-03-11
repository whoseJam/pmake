/*

### 一、动画场景整体构思
1. **场景布局**：
    - 屏幕主要区域展示一棵用 `sd.DAG` 表示的剧情选择图，图的节点代表剧情点，有向边代表剧情走向。
    - 屏幕下方设置一个 `sd.Button` 按钮，用于让角色回到游戏开始的 1 号剧情点。
2. **交互逻辑**：
    - 初始状态下，展示完整的剧情选择图，所有节点和树枝为正常颜色（例如黑色）。
    - 当用户点击某个节点时，使用 `sd.Focus` 效果突出显示当前点击的节点，表示 JYY 移动到了该剧情点，同时将经过的节点和树枝涂成灰色，表示已经走过。
    - 点击屏幕下方的按钮，角色回到 1 号剧情点，所有节点和边恢复为初始颜色（黑色）。

### 二、需求文档
1. **动画元素**：
    - **sd.DAG（剧情选择图）**：
        - **数据来源**：根据输入文件中的剧情点信息（$N$ 个剧情点，每个剧情点的 $K_i$ 以及对应的 $b_{i,j}$ 和 $t_{i,j}$）构建有向图结构。
        - **样式设置**：节点使用圆形表示，节点内显示剧情点编号；树枝使用线条连接节点。初始状态下，节点和树枝颜色为黑色。
    - **sd.Focus（聚焦效果）**：
        - **触发条件**：当用户点击某个节点时，该节点获得 `sd.Focus` 效果。
        - **效果表现**：获得聚焦效果的节点周围出现一圈明亮的光晕（例如黄色），以突出显示当前所在剧情点。
    - **sd.Button（重置按钮）**：
        - **位置**：屏幕下方。
        - **文本显示**：“重新开始”。
        - **功能**：点击按钮后，所有节点和树枝恢复初始颜色（黑色），表示角色回到 1 号剧情点，重新开始游戏。
2. **动画逻辑**：
    - **交互逻辑**：
        - **点击节点**：
            - 当用户点击某个节点时，首先检查该节点是否已经走过（是否为灰色）且是当前所在节点的邻接点。
            - 如果未走过，使用 `sd.Focus` 效果突出显示该节点，同时将从根节点到该节点经过的所有节点和树枝涂成灰色。
        - **点击按钮**：
            - 当用户点击屏幕下方的“重新开始”按钮时，遍历图的所有节点和树枝，将它们的颜色恢复为初始的黑色。
3. **数据处理**：
    - 在动画运行过程中，记录每个节点是否被访问过（通过颜色判断，初始为黑色表示未访问，灰色表示已访问）。

### 三、代码结构建议
1. **动画初始化模块**：使用 links 构建 `sd.DAG` 剧情选择图，并在屏幕上显示，同时初始化 `sd.Button` 按钮。
2. **交互事件处理模块**：
    - 监听节点的点击事件，处理节点的聚焦和颜色变化逻辑。
    - 监听按钮的点击事件，处理重置动画的逻辑。

### 四、注意事项
1. 在构建 `sd.DAG` 时，需要确保节点和树枝的布局合理，避免重叠，以保证动画的可视化效果。
2. 处理点击事件时，要注意事件的准确性和响应速度，确保用户交互体验良好。
3. 确保所有使用的 `SD` 动画框架组件和函数方法都符合官方文档的要求，并且代码风格与 `example` 文件夹下的文件保持一致。 

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();

const links = [
    [1, 2, 1],
    [1, 3, 2],
    [2, 4, 3],
    [2, 5, 4],
    [3, 5, 5],
    [3, 6, 6],
];

const totalPathLength = new sd.Text(svg, `总长度：${0}`);
const button = new sd.Button(svg).text("重置");
const dag = new sd.DAG(svg).x(100).y(100).width(150).height(150);
const focus = sd.Focus(dag);
let currentNode;

sd.init(() => {
    links.forEach(link => {
        dag.link(link[0], link[1], link[2]);
        dag.element(link[0], link[1]).arrow();
    });
    dag.forEachNode(node => {
        node.onClick(() => {
            const checkLink = dag.findLinkById(dag.nodeId(currentNode), dag.nodeId(node));
            if (!checkLink) return;
            sd.inter(async () => {
                focus.startAnimate().focus(node).endAnimate();
                node.startAnimate().color(C.grey).endAnimate();
                totalPathLength.length += checkLink.intValue();
                totalPathLength.text(`总长度：${totalPathLength.length}`);
                currentNode = node;
            });
        });
    });
    button.onClick(() => {
        currentNode = dag.element(1);
        focus.startAnimate().focus(1).endAnimate();
    });
    totalPathLength.x(dag.x() - 20).my(dag.y() - 20);
    totalPathLength.length = 0;
    button.mx(dag.mx() + 20).my(dag.y() - 20);
});

sd.init(() => {});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_FRAME);
    currentNode = dag.element(1);
    focus.startAnimate().focus(1).endAnimate();
    dag.startAnimate().color(1, C.grey).endAnimate();
});
