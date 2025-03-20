/*

luogu P4043

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

*/

/*
评价：计算逻辑正确，动画逻辑错误。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

// 示例输入数据，这里使用一个示例数据，其中 N 个剧情点及其对应的信息：
// 这个例子中有6个节点，常常从1号节点开始，格式为 [剧情点数量, [ [下一剧情点编号, 时间], [下一剧情点编号, 时间], ... ], [ [下一剧情点编号, time], [下一剧情点num, 时间], ... ], ... ]
const inputData = {
    N: 6,
    edges: [
        [], // 0号剧情点不使用
        [
            [2, 1],
            [3, 2],
        ], // 剧情点1可以前往剧情点2（花费时间为1）和剧情点3（花费时间为2）
        [
            [4, 3],
            [5, 4],
        ], // 剧情点2可以前往剧情点4（花费时间为3）和剧情点5（花费时间为4）
        [
            [5, 5],
            [6, 6],
        ], // 剧情点3可以前往剧情点5（花费时间为5）和剧情点6（花费时间6）
        [], // 剧情点4是一个结局，没有支线剧情
        [], // 剧情点5是一个结局，没有支线剧情
        [], // 剧情点6是一个结局，没有支线剧情
    ],
};

// 初始化 DAG 图
let dag = new sd.DAG(svg).rankDir("LR");
let nodes = [];
let edges = [];

const nodeRadius = 30;

// 创建节点数据，并添加到 DAG 图中
for (let i = 1; i <= inputData.N; i++) {
    dag.newNode(i);
    nodes.push(dag.element(i));
}

// 添加边到 DAG 图中
for (let i = 1; i <= inputData.N; i++) {
    let currentEdges = inputData.edges[i]; // 获得第 i 个剧情点的支线剧情信息
    for (let edge of currentEdges) {
        let [target, time] = edge;
        let edgeObj = dag.link(i, target, `${time}`); // 添加边, 并将时间作为边标签
        edges.push({ from: i, to: target, edge: edgeObj });
        dag.element(i, target).arrow();
    }
}

let visitedNodes = new Set(); // 记录访问过的节点
let visitedEdges = new Set(); // 记录访问过的边索引
let currentNode = 1; // 初始化当前节点为1号剧情点

// 1号节点初始状态为黄色，表示当前所在位置
nodes[0].color(C.yellow);
visitedNodes.add(1);

// 点击节点事件处理函数
dag.forEachNode(node => {
    node.onClick(() => {
        sd.inter(async () => {
            const nodeIndex = nodes.indexOf(node) + 1;
            if (nodeIndex !== currentNode) {
                const edgeObj = edges.find(e => e.from === currentNode && e.to === nodeIndex);
                if (edgeObj && !visitedEdges.has(edgeObj)) {
                    visitedEdges.add(edgeObj);

                    if (!visitedNodes.has(nodeIndex)) {
                        //nodes[currentNode - 1].color(C.grey);  // 将当前节点颜色设置为灰色
                        node.startAnimate().color(C.yellow).endAnimate();
                        currentNode = nodeIndex;
                        visitedNodes.add(nodeIndex);
                    }
                } else {
                    alert("不能访问该节点！");
                    return;
                }
            } else if (nodeIndex === 1) {
                alert("已经在1号剧情点！");
            }
        });
    });
});

// 重新开始游戏按钮
const resetButton = new sd.Button(div).text("重新开始").x(200).y(50);
resetButton.onClick(async () => {
    sd.inter(async () => {
        for (let node of nodes) {
            node.color(C.black);
        }
        for (let edge of edges) {
            edge.edge.color(C.black);
        }
        nodes[0].color(C.yellow); // 1号节点初始为黄色，表示回到1号剧情点
        currentNode = 1;
        visitedNodes.clear();
        visitedNodes.add(1);
        visitedEdges.clear();
    });
});

// 动画主函数
sd.main(async () => {});
