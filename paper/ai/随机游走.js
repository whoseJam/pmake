/*

luogu P5643

#### 初始化阶段：
1. **创建 SVG 画布：**
   - 使用 `sd.svg` 函数创建名为 `svg` 的 SVG 画布。
   
2. **创建树结构：**
   - 使用 `sd.Tree` 组件来初始化和表示输入的树结构。

3. **节点表示及其颜色：**
   - 将起点节点标记为特殊颜色，例如 `C.pureBlue`。
   - 如果目标集合 $S$ 已知，使用另一种颜色来标识集合中的节点例如 `C.green`。
   - 其他普通节点使用默认颜色，通常为 `C.grey`。

4. **游走标识：**
   - 使用一个特殊的标识符，如 sd.Focus，来标识当前游走到的节点位置，从而动态显示随机游走过程。

#### 主要动画阶段：
1. **从给定的起点节点开始游走：**
   - 在每一帧中随机选择一条与当前节点相邻的边，游走到相邻的节点。
   - 使用一个变量记录当前游走的步数，并在每次游走时更新并显示该步数。

2. **记录已访问的目标节点：**
   - 当游走到目标集合 $S$ 中的一个节点时，标记该节点为已经访问过，例如将其颜色改为 `C.paleGreen`。
   - 继续游走，直到目标集合 $S$ 中的每一个节点都至少被访问一次。

3. **停止游走并显示结果：**
   - 一旦目标集合 $S$ 中所有节点都被访问过，动画停下来并显示总共的游走步数或其他结束标志。
   - 如果涉及多次模拟这个过程，重置所有节点状态和颜色，并重新开始游走。

#### 交互式设计：
1. **重置游走过程：**
   - 提供一个 `sd.Button` 用于重置游走过程，重新开始新一轮的游走。

#### 布局设计：
1. **树结构布局：**
   - 通常将起点节点放置在画布中心或画布顶部中央位置，然后按照树的结构向下或向外延伸布局其他节点。

*/

/*
计算逻辑正确，动画逻辑错误。
*/

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

const n = 3;
const edges = [
    [1, 2],
    [2, 3],
];
const x = 1;

// 初始化树结构及其节点颜色标记。
function initTree(tree, edges, rootNode) {
    tree.newNode(rootNode.toString(), rootNode.toString());

    const adjacencyList = new Array(n + 1).fill(null).map(() => []);
    for (const [u, v] of edges) {
        adjacencyList[u].push(v);
        adjacencyList[v].push(u);
    }

    const queue = [rootNode];
    const visited = new Set([rootNode]);

    while (queue.length > 0) {
        const current = queue.shift();
        for (const neighbor of adjacencyList[current]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                tree.newNode(neighbor.toString(), neighbor.toString());
                tree.link(current.toString(), neighbor.toString());
            }
        }
    }
}

const tree = new sd.Tree(svg).layerHeight(100);
initTree(tree, edges, x);
const startNode = tree.element(x.toString());
startNode.color(C.pureBlue);

const resetButton = new sd.Button(div)
    .text("Reset")
    .cx(250)
    .y(-60)
    .onClick(() => {
        sd.inter(() => {
            resetTree();
        });
    });

function resetTree() {
    tree.nodes().forEach(node => {
        node.color(C.white);
    });
    startNode.color(C.pureBlue);
    currentStep = 0;
    stepCounter.text(`Steps: ${currentStep}`);
}

const stepCounter = new sd.Text(svg).text("Steps: 0").x(250).y(-90).fontSize(20).color(C.black);

let currentStep = 0;

function updateStepCounter() {
    stepCounter.text(`Steps: ${currentStep}`);
}

function resetStepCounter() {
    currentStep = 0;
    updateStepCounter();
}

function incrementStepCounter() {
    currentStep++;
    updateStepCounter();
}

function checkTargetNodes(visitedNodes, querySet) {
    return querySet.every(node => visitedNodes.has(node));
}

sd.main(async () => {
    await sd.pause();

    const queries = [
        { k: 1, S: [1] },
        { k: 1, S: [3] },
        { k: 2, S: [2, 3] },
        { k: 3, S: [1, 2, 3] },
        { k: 2, S: [1, 2] },
    ];

    for (let q = 0; q < queries.length; q++) {
        const { S } = queries[q];
        const button = new sd.Button(div)
            .text(`Run Query ${q + 1}: [${S.join(", ")}]`)
            .cx(250)
            .y(60 + 40 * q)
            .onClick(() => {
                sd.inter(async () => {
                    await randomWalk(S);
                });
            });
    }
});

async function randomWalk(querySet) {
    const S = querySet;
    const visitedNodes = new Set([x]);

    resetStepCounter();
    tree.nodes().forEach(node => {
        node.color(C.white);
    });

    startNode.color(C.pureBlue);

    S.forEach(nodeNum => {
        const node = tree.element(nodeNum.toString());
        if (node) {
            node.color(C.paleGreen);
        }
    });

    if (S.includes(x)) {
        startNode.color(C.pureBlue);
    }

    let currentNode = startNode;
    currentNode.color(C.orange);

    while (!checkTargetNodes(visitedNodes, S)) {
        const neighbors = tree.adjacentNodes(currentNode.id);
        let nextNodeIndex = Math.floor(Math.random() * neighbors.length);
        let nextNode = neighbors[nextNodeIndex];

        if (querySet.includes(parseInt(currentNode.id)) && visitedNodes.has(parseInt(currentNode.id))) {
            currentNode.color(C.green);
        } else {
            currentNode.color(C.white);
        }

        currentNode = nextNode;
        const nodeId = parseInt(currentNode.id);
        if (!visitedNodes.has(nodeId)) {
            visitedNodes.add(nodeId);
        }

        currentNode.color(C.orange);

        incrementStepCounter();
        await sd.pause();
    }

    currentNode.color(C.grey);
    if (querySet.includes(parseInt(currentNode.id))) {
        currentNode.color(C.paleGreen);
    } else {
        currentNode.color(C.white);
    }
}

resetTree();
