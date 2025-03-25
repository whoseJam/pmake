/*
luogu P1113

### 1. 初始化阶段：
   - 创建画布。
   - 用矩形 `sd.Rect` 表示每一个杂务，其中高度代表完成杂务所需的时间。
   - 用文本 `sd.Text` 在矩形内部或上方显示杂务编号及其所需时间。
   - 用带有箭头的线条 `sd.Line` 表示杂务之间的依赖关系，箭头从依赖项指向被依赖的工作（例如，如果杂务2依赖于杂务1，箭头应从杂务2的矩形指向杂务1的矩形）。
   - 使用 `sd.BoxDAG` 来完成杂物的布局。 

### 2. 主要动画阶段：
   - 杂务1没有依赖关系，从第一个时刻开始执行，填充第一个矩形表示任务开始执行。
   - 如果杂务k的依赖项都已经完成任务，则杂务k可以开始执行，此时用颜色填充杂务k的矩形表示开始执行。
   - 使用拓扑排序，动态规划算出每个杂务被完成的最短时间 f[i]，并把 f[i] 写在杂务对应的节点的顶部。

### 3. 交互式设计：
无。

### 4. 布局设计：
   - 杂务的矩形在画布上按编号顺序排列，可以是垂直排列或水平排列，每个矩形之间有适当的间距。
   - 连线代表依赖关系，应清晰以避免混淆交叉。
   - 总耗时显示在画布的角落。
*/

import * as sd from "@/sd";

const C = sd.color();

// 初始化画布
const svg = sd.svg();
const div = sd.div();

function createTaskNode(taskId, timeReq) {
    let taskBox = new sd.Rect(svg);
    taskBox.width(80).height(timeReq * 10); // 假设每单位时间为10像素高度，宽度固定为80
    taskBox.cx(0).cy(0); // 将矩形中心点临时设为原点以便于后续布局

    let idText = new sd.Text(taskBox).text(`任务 ${taskId}`).center(0, -40); // 将文本节点放在矩形节点内部，并垂直居中于矩形上方10个单位
    let timeText = new sd.Text(taskBox).text(`时间: ${timeReq}`).center(0, -20);

    return taskBox;
}

let N = 7; // 假设杂务总数已经在输入中定义
const taskDescriptions = [
    [1, 5, 0],
    [2, 2, 1, 0],
    [3, 3, 2, 0],
    [4, 6, 1, 0],
    [5, 1, 2, 4, 0],
    [6, 8, 2, 4, 0],
    [7, 4, 3, 5, 6, 0],
];

const tasks = [];
const graph = new Array(N + 1).fill(null).map(() => []);
const inDegree = new Array(N + 1).fill(0);
const taskDuration = new Array(N + 1).fill(0);
const f = new Array(N + 1).fill(0); // 动态规划数组，存储最早完成时间

for (let desc of taskDescriptions) {
    const id = desc[0];
    const time = desc[1];
    const dependents = desc.slice(2, desc.indexOf(0));

    taskDuration[id] = time;

    for (let dep of dependents) {
        graph[dep].push(id);
        inDegree[id]++;
    }
}

const topologicalSort = () => {
    const queue = [];
    for (let i = 1; i <= N; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
            f[i] = taskDuration[i];
        }
    }

    while (queue.length) {
        let u = queue.shift();
        for (let v of graph[u]) {
            inDegree[v]--;
            if (inDegree[v] === 0) {
                queue.push(v);
            }
            f[v] = Math.max(f[v], f[u] + taskDuration[v]);
        }
    }

    return Math.max(...f);
};

// 创建任务节点
for (let i = 1; i <= N; i++) {
    let taskNode = createTaskNode(i, taskDuration[i]);
    tasks.push(taskNode);
}

// 创建 BoxDAG 图形以布局杂务任务节点
const dag = new sd.BoxDAG(svg);
for (let i = 1; i <= N; i++) {
    dag.childAs(`node${i}`, tasks[i - 1]);
}
for (let u = 1; u <= N; u++) {
    for (let v of graph[u]) {
        dag.addVertice(`node${u}`, `node${v}`, true);
    }
}

sd.main(async () => {
    dag.layoutIter(1000).updatePosition().alignVertical(220, 40); // 调整节点垂直排列，间隔为40

    await sd.pause();

    let topoSortQueue = [];
    for (let i = 1; i <= N; i++) {
        if (inDegree[i] === 0) {
            topoSortQueue.push(i);
        }
    }

    // 执行拓扑排序算法动效展示节点执行顺序
    while (topoSortQueue.length > 0) {
        let queueLength = topoSortQueue.length;
        for (let i = 0; i < queueLength; i++) {
            let u = topoSortQueue.shift();

            // 高亮当前的节点，颜色先变为浅绿色表示开始执行，然后变为绿色表示执行完成
            tasks[u - 1].startAnimate().color(C.azure).endAnimate();

            await sd.pause(300);

            if (f[u] === 0) f[u] = taskDuration[u];

            // 传递完成时间到后继任务
            for (let v of graph[u]) {
                f[v] = Math.max(f[v], f[u] + taskDuration[v]);
                inDegree[v]--;
                if (inDegree[v] === 0) {
                    topoSortQueue.push(v);
                }
            }

            tasks[u - 1].startAnimate().color(C.blue).endAnimate();

            // 将完成时间显示在节点下方
            new sd.Text(tasks[u - 1]).text(`完成时间: ${f[u]}`).center(0, 20);
        }
    }

    const totalTime = Math.max(...f);
    new sd.Text(svg).text(`总耗时: ${totalTime}`).x(50).y(50);
});
