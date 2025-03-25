/*

luogu P1967

**需求文档：货车运输问题动画展示**

### 1. 初始化阶段

1. 使用 sd.Vertex 组件来表示城市节点，每个组件中央使用 sd.Text 组件显示城市编号（如：城市 1 使用一个 sd.Vertex 包含一个 sd.Text 显示“1”）。
   
2. 使用 sd.Line 组件来表示连接两个城市之间的道路，并在每条 sd.Line 上方或旁边使用 sd.Text 组件显示该道路的限重值。

3. 总体上，使用 sd.Tree 组件来表示多个城市构成的树形结构。

### 2. 主要动画阶段

1. 使用 sd.Rect 作为货车图标，表示一辆货车从起点城市出发前往终点城市。
    
2. 在货车行进过程中，应动态展示货车在道路上的移动，并实时跟踪所经过路径上的最小限重值。可以在货车图标上方添加一个 sd.Text 组件来实时显示当前已通过路径上的最小限重值。

3. 主要逻辑描述：
   - 首先，展示使用 Kruskal 算法构建最大生成树的过程。
   - 其次，对于每一个查询，若起点城市和终点城市在同一棵树（连通分量）中，则利用 LCA (最近公共祖先) 算法查询两点路径上的最小边权重值，并将该值实时展示在货车图标上方的 sd.Text 组件中。
   - 如果货车无法从起点城市到达终点城市（即在不同的连通分量中），则展示一个 sd.Text 提示输出“-1”。

### 3. 交互式设计

1. 使用 sd.Button 来接受用户的交互动作，每点击一次 sd.Button，模拟输入一个城市对 $(x, y)$，进而触发以下事件：
   - 高亮展示从城市 $x$ 到城市 $y$ 的路径。
   - 货车从城市 $x$ 出发，沿路径逐步移动到城市 $y$，并实时更新当前路径上的最小限重值。
   - 如果城市 $x$ 和城市 $y$ 之间不存在路径连通，动画应展示一个 sd.Text 提示“-1”。

### 4. 布局设计

1. 城市节点 (sd.Vertex) 的布局可以采用合理的分布方式，使得城市节点之间的连线不会过于混乱，便于观察。

2. 道路连接 (sd.Line) 的布局应清晰明了，道路上需放置 sd.Text 组件以显示限重值。

3. 货车行进动画由 sd.Rect 组件沿 sd.Line 移动完成，在移动过程中，货车图标上方始终跟随一个 sd.Text 组件显示当前路径上的最小限重值。

*/

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const N = 7; // 示例城市数量
const M = 10; // 示例道路数量
const roads = [
    [1, 2, 4],
    [2, 3, 3],
    [3, 1, 1],
    [3, 4, 7],
    [4, 5, 2],
    [5, 6, 5],
    [6, 7, 6],
    [7, 1, 9],
    [4, 7, 8],
    [2, 5, 6],
];
const queries = [
    [1, 3],
    [1, 4],
    [1, 5],
]; // 示例查询

// 并查集，用于Krushkal算法
class UnionFind {
    constructor(n) {
        this.parent = new Array(n + 1).fill(0).map((_, i) => i);
        this.rank = new Array(n + 1).fill(0);
    }

    find(u) {
        if (this.parent[u] !== u) {
            this.parent[u] = this.find(this.parent[u]);
        }
        return this.parent[u];
    }

    union(u, v) {
        let pu = this.find(u);
        let pv = this.find(v);
        if (pu === pv) {
            return false;
        }
        if (this.rank[pu] > this.rank[pv]) {
            this.parent[pv] = pu;
        } else if (this.rank[pu] < this.rank[pv]) {
            this.parent[pu] = pv;
        } else {
            this.parent[pv] = pu;
            this.rank[pu]++;
        }
        return true;
    }
}

// 题目输入：用roads表示道路，首先按照限重降序排序
roads.sort((a, b) => b[2] - a[2]);

const uf = new UnionFind(N);
const graph = new Array(N + 1).fill(null).map(() => []); // 用于存储最大生成树
for (let road of roads) {
    let [x, y, z] = road;
    if (uf.union(x, y)) {
        graph[x].push({ to: y, weight: z });
        graph[y].push({ to: x, weight: z });
    }
}

// 搭建城市节点图
const vertices = [];
const vertexPositions = {};
const vertexAngleStep = (2 * Math.PI) / N;
const vertexRadius = 160;
const centerX = 300;
const centerY = 300;

for (let i = 1; i <= N; i++) {
    let angle = vertexAngleStep * (i - 1);
    let x = centerX + vertexRadius * Math.cos(angle);
    let y = centerY + vertexRadius * Math.sin(angle);
    vertexPositions[i] = [x, y];
    let node = new sd.Vertex(svg);
    node.text(i.toString());
    node.center(x, y);
    vertices.push(node);
}

// 绘制原始道路
const lineMap = {};
for (let [x, y, z] of roads) {
    let line = new sd.Line(svg, vertexPositions[x], vertexPositions[y]).strokeWidth(2).stroke(C.black);
    let midPoint = [(vertexPositions[x][0] + vertexPositions[y][0]) / 2, (vertexPositions[x][1] + vertexPositions[y][1]) / 2];
    let text = new sd.Text(svg, z.toString()).center(midPoint[0], midPoint[1] - 10);
    lineMap[`${x}-${y}k`] = { line, text };
    lineMap[`${y}-${x}k`] = { line, text };
}

// 显示最大生成树过程
sd.main(async () => {
    await sd.pause();
    const uf = new UnionFind(N);
    let maxSpanningTree = [];
    for (let [x, y, z] of roads) {
        if (uf.union(x, y)) {
            maxSpanningTree.push([x, y, z]);
            // Highlight the edge only if it was added to the MST
            let edge = lineMap[`${x}-${y}k`];
            edge.line.stroke(C.green).strokeWidth(4);
            await sd.pause(1000);
        }
    }
    await sd.pause();
});

// 查询处理函数：这里直接使用预计算的路径作为示例，实际应使用LCA算法
const query = async query => {
    sd.main(async () => {
        const [start, end] = query;
        if (uf.find(start) != uf.find(end)) {
            // 如果两点不连通，显示 -1
            let text = new sd.Text(svg, "-1").center(centerX, centerY).color({ fill: C.red, stroke: C.black });
            await sd.pause();
            text.opacity(0);
        } else {
            let visited = new Array(N + 1).fill(false);
            visited[start] = true;
            let path = [];
            let minWeight = Number.MAX_SAFE_INTEGER;
            const dfs = async (u, target, currPath, currMinWeight) => {
                if (u == target) {
                    path = [...currPath];
                    minWeight = currMinWeight;
                    return true;
                }
                for (let { to, weight } of graph[u]) {
                    if (!visited[to]) {
                        visited[to] = true;
                        let innerMinWeight = Math.min(currMinWeight, weight);
                        let found = await dfs(to, target, [...currPath, to], innerMinWeight);
                        if (found) return true;
                        visited[to] = false;
                    }
                }
                return false;
            };
            await dfs(start, end, [start], Number.MAX_SAFE_INTEGER);
            let truck = new sd.Rect(svg).color(C.blue).center(vertexPositions[start][0], vertexPositions[start][1]);
            let text_weight = new sd.Text(svg, minWeight == Number.MAX_SAFE_INTEGER ? "Inf" : minWeight.toString()).dx(30);
            truck.childAs(text_weight);

            for (let i = 0; i < path.length - 1; i++) {
                let aa = path[i],
                    bb = path[i + 1];
                let nextPos = vertexPositions[bb];
                await truck.startAnimate(1000).center(nextPos[0], nextPos[1]).endAnimate();
                for (let edge of graph[aa]) {
                    if (edge.to === bb) {
                        minWeight = Math.min(minWeight, edge.weight);
                        break;
                    }
                }
                text_weight.content(minWeight == Number.MAX_SAFE_INTEGER ? "Inf" : minWeight.toString());
            }
            await sd.pause();
            truck.black();
            text_weight.black();
        }
    });
};

// 交互按钮处理
for (let i = 0; i < queries.length; i++) {
    let queryButton = new sd.Button(sd.div(), `Query ${queries[i][0]} to ${queries[i][1]}`).onClick(() => query(queries[i]));
}

sd.main(async () => {});
