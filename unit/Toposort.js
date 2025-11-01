import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

// Create DAG graph for topological sort
const graph = new sd.DAG(svg).cx(600).cy(250);

// Create caption for explanation
const caption = new sd.Caption(svg).cx(600).y(520);

// Create queue to show nodes with zero in-degree
const queue = new sd.Array(svg).resize(6).start(1);

// Create result array to show topological order
const result = new sd.Array(svg).resize(6).start(1);

// Define graph structure
const nodes = ["A", "B", "C", "D", "E", "F"];
const edges = [
    ["A", "C"],
    ["A", "D"],
    ["B", "C"],
    ["B", "E"],
    ["C", "F"],
    ["D", "F"],
    ["E", "F"],
];

// Calculate in-degrees
const inDegree = {
    A: 0,
    B: 0,
    C: 2,
    D: 1,
    E: 1,
    F: 3,
};

sd.init(() => {
    // Position queue and result arrays
    queue.x(150).y(50);
    result.x(150).y(480);

    // Add labels
    // sd.Brace(queue).brace(1, 6, "t").value("Queue (In-degree = 0)");
    // sd.Brace(result).brace(1, 6, "b").value("Topological Order");

    // Initialize arrays as empty
    for (let i = 1; i <= 6; i++) {
        queue.value(i, " ");
        result.value(i, " ");
    }
});

sd.main(async () => {
    // Step 1: Introduction
    caption.caption("拓扑排序：对有向无环图进行线性排序", "Topological Sort: Linear ordering of a DAG");
    await sd.pause(2000);

    // Step 2: Build the graph
    caption.caption("首先构建一个有向无环图", "First, build a directed acyclic graph");
    await sd.pause(1000);

    for (let i = 0; i < nodes.length; i++) {
        await sd.pause(500);
        graph.startAnimate();
        graph.newNode(nodes[i]);
        graph.endAnimate();
    }

    await sd.pause(1000);
    caption.caption("添加有向边", "Add directed edges");
    await sd.pause(1000);

    for (let i = 0; i < edges.length; i++) {
        await sd.pause(500);
        graph.startAnimate();
        graph.newLink(edges[i][0], edges[i][1]);
        graph.element(edges[i][0], edges[i][1]).arrow().strokeWidth(1.5);
        graph.endAnimate();
    }

    await sd.pause(1500);

    // Step 3: Explain the algorithm
    caption.caption("使用Kahn算法：找出所有入度为0的节点", "Using Kahn's Algorithm: Find all nodes with in-degree 0");
    await sd.pause(2000);

    // Step 4: Initialize queue with zero in-degree nodes
    caption.caption("将入度为0的节点加入队列", "Add nodes with in-degree 0 to queue");
    await sd.pause(1000);

    let queueIdx = 1;
    for (let node of nodes) {
        if (inDegree[node] === 0) {
            await sd.pause(800);
            graph.startAnimate();
            graph.element(node).fill(C.yellow);
            graph.endAnimate();

            queue.startAnimate();
            queue.value(queueIdx, node);
            queue.color(queueIdx, C.yellow);
            queue.endAnimate();
            queueIdx++;
        }
    }

    await sd.pause(1500);

    // Step 5: Process the queue
    caption.caption("开始处理队列中的节点", "Start processing nodes in the queue");
    await sd.pause(1500);

    let resultIdx = 1;
    let processedQueue = 1;
    const currentInDegree = { ...inDegree };
    const processed = new Set();

    // Process A
    caption.caption("取出节点A，加入结果序列", "Dequeue node A, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("A").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "A");
    result.color(resultIdx, C.green);
    result.endAnimate();
    resultIdx++;

    queue.startAnimate();
    queue.value(processedQueue, " ");
    queue.color(processedQueue, C.white);
    queue.endAnimate();
    processedQueue++;

    processed.add("A");
    await sd.pause(1000);

    // Update neighbors of A
    caption.caption("更新A的邻居节点的入度", "Update in-degrees of A's neighbors");
    await sd.pause(1000);

    for (let edge of edges) {
        if (edge[0] === "A") {
            const neighbor = edge[1];
            await sd.pause(500);

            graph.startAnimate();
            graph.element("A", neighbor).stroke(C.red).strokeWidth(2.5);
            graph.endAnimate();

            currentInDegree[neighbor]--;

            await sd.pause(500);

            if (currentInDegree[neighbor] === 0) {
                graph.startAnimate();
                graph.element(neighbor).fill(C.yellow);
                graph.endAnimate();

                queue.startAnimate();
                queue.value(queueIdx, neighbor);
                queue.color(queueIdx, C.yellow);
                queue.endAnimate();
                queueIdx++;
            }

            graph.startAnimate();
            graph.element("A", neighbor).stroke(C.grey).strokeWidth(1.5);
            graph.endAnimate();
        }
    }

    await sd.pause(1500);

    // Process B
    caption.caption("取出节点B，加入结果序列", "Dequeue node B, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("B").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "B");
    result.color(resultIdx, C.green);
    result.endAnimate();
    resultIdx++;

    queue.startAnimate();
    queue.value(processedQueue, " ");
    queue.color(processedQueue, C.white);
    queue.endAnimate();
    processedQueue++;

    processed.add("B");
    await sd.pause(1000);

    // Update neighbors of B
    caption.caption("更新B的邻居节点的入度", "Update in-degrees of B's neighbors");
    await sd.pause(1000);

    for (let edge of edges) {
        if (edge[0] === "B") {
            const neighbor = edge[1];
            await sd.pause(500);

            graph.startAnimate();
            graph.element("B", neighbor).stroke(C.red).strokeWidth(2.5);
            graph.endAnimate();

            currentInDegree[neighbor]--;

            await sd.pause(500);

            if (currentInDegree[neighbor] === 0 && !processed.has(neighbor)) {
                graph.startAnimate();
                graph.element(neighbor).fill(C.yellow);
                graph.endAnimate();

                queue.startAnimate();
                queue.value(queueIdx, neighbor);
                queue.color(queueIdx, C.yellow);
                queue.endAnimate();
                queueIdx++;
            }

            graph.startAnimate();
            graph.element("B", neighbor).stroke(C.grey).strokeWidth(1.5);
            graph.endAnimate();
        }
    }

    await sd.pause(1500);

    // Process D
    caption.caption("取出节点D，加入结果序列", "Dequeue node D, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("D").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "D");
    result.color(resultIdx, C.green);
    result.endAnimate();
    resultIdx++;

    queue.startAnimate();
    queue.value(3, " ");
    queue.color(3, C.white);
    queue.endAnimate();

    processed.add("D");
    await sd.pause(1000);

    // Update neighbors of D
    caption.caption("更新D的邻居节点的入度", "Update in-degrees of D's neighbors");
    await sd.pause(1000);

    for (let edge of edges) {
        if (edge[0] === "D") {
            const neighbor = edge[1];
            await sd.pause(500);

            graph.startAnimate();
            graph.element("D", neighbor).stroke(C.red).strokeWidth(2.5);
            graph.endAnimate();

            currentInDegree[neighbor]--;

            await sd.pause(500);

            graph.startAnimate();
            graph.element("D", neighbor).stroke(C.grey).strokeWidth(1.5);
            graph.endAnimate();
        }
    }

    await sd.pause(1500);

    // Process C
    caption.caption("取出节点C，加入结果序列", "Dequeue node C, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("C").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "C");
    result.color(resultIdx, C.green);
    result.endAnimate();
    resultIdx++;

    queue.startAnimate();
    queue.value(4, " ");
    queue.color(4, C.white);
    queue.endAnimate();

    processed.add("C");
    await sd.pause(1000);

    // Update neighbors of C
    caption.caption("更新C的邻居节点的入度", "Update in-degrees of C's neighbors");
    await sd.pause(1000);

    for (let edge of edges) {
        if (edge[0] === "C") {
            const neighbor = edge[1];
            await sd.pause(500);

            graph.startAnimate();
            graph.element("C", neighbor).stroke(C.red).strokeWidth(2.5);
            graph.endAnimate();

            currentInDegree[neighbor]--;

            await sd.pause(500);

            if (currentInDegree[neighbor] === 0 && !processed.has(neighbor)) {
                graph.startAnimate();
                graph.element(neighbor).fill(C.yellow);
                graph.endAnimate();

                queue.startAnimate();
                queue.value(queueIdx, neighbor);
                queue.color(queueIdx, C.yellow);
                queue.endAnimate();
                queueIdx++;
            }

            graph.startAnimate();
            graph.element("C", neighbor).stroke(C.grey).strokeWidth(1.5);
            graph.endAnimate();
        }
    }

    await sd.pause(1500);

    // Process E
    caption.caption("取出节点E，加入结果序列", "Dequeue node E, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("E").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "E");
    result.color(resultIdx, C.green);
    result.endAnimate();
    resultIdx++;

    queue.startAnimate();
    queue.value(5, " ");
    queue.color(5, C.white);
    queue.endAnimate();

    processed.add("E");
    await sd.pause(1000);

    // Update neighbors of E
    caption.caption("更新E的邻居节点的入度", "Update in-degrees of E's neighbors");
    await sd.pause(1000);

    for (let edge of edges) {
        if (edge[0] === "E") {
            const neighbor = edge[1];
            await sd.pause(500);

            graph.startAnimate();
            graph.element("E", neighbor).stroke(C.red).strokeWidth(2.5);
            graph.endAnimate();

            currentInDegree[neighbor]--;

            await sd.pause(500);

            if (currentInDegree[neighbor] === 0 && !processed.has(neighbor)) {
                graph.startAnimate();
                graph.element(neighbor).fill(C.yellow);
                graph.endAnimate();
            }

            graph.startAnimate();
            graph.element("E", neighbor).stroke(C.grey).strokeWidth(1.5);
            graph.endAnimate();
        }
    }

    await sd.pause(1500);

    // Process F
    caption.caption("取出节点F，加入结果序列", "Dequeue node F, add to result");
    await sd.pause(1000);

    graph.startAnimate();
    graph.element("F").fill(C.green);
    graph.endAnimate();

    result.startAnimate();
    result.value(resultIdx, "F");
    result.color(resultIdx, C.green);
    result.endAnimate();

    queue.startAnimate();
    queue.value(6, " ");
    queue.color(6, C.white);
    queue.endAnimate();

    await sd.pause(2000);

    // Final summary
    caption.caption(
        "拓扑排序完成！结果：A → B → D → C → E → F",
        "Topological sort complete! Result: A → B → D → C → E → F"
    );
    await sd.pause(3000);

    caption.caption("时间复杂度：O(V+E)，空间复杂度：O(V)", "Time: O(V+E), Space: O(V)");
    await sd.pause(3000);
});
