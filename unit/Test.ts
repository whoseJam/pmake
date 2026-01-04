import * as sd from "@/sd";

const svg = sd.svg();

// 标题
const title = new sd.Text({
    targetNode: svg,
    text: "树 (Tree) 的基础概念",
    fontSize: 36,
    fill: "#333",
    y: 50,
    opacity: 0,
});
title.setCenterX(600);

// 说明文字区域
const descText = new sd.Text({
    targetNode: svg,
    text: "",
    fontSize: 24,
    fill: "#555",
    y: 530,
    opacity: 0,
});
descText.setCenterX(600);

// 节点配置
const nodeRadius = 30;
const nodeColor = "#E3F2FD";
const nodeStroke = "#1E88E5";
const highlightColor = "#FFECB3";
const highlightStroke = "#FF8F00";

// 节点数据
const nodesData = [
    { id: "A", x: 600, y: 150, label: "A" },
    { id: "B", x: 400, y: 300, label: "B" },
    { id: "C", x: 800, y: 300, label: "C" },
    { id: "D", x: 300, y: 450, label: "D" },
    { id: "E", x: 500, y: 450, label: "E" },
    { id: "F", x: 800, y: 450, label: "F" },
];

// 连线数据
const linksData = [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "B", to: "E" },
    { from: "C", to: "F" },
];

const nodeMap: Record<string, { circle: sd.Circle; text: sd.Text }> = {};
const linkMap: Record<string, sd.Line> = {};

// 创建连线
linksData.forEach(link => {
    const fromNode = nodesData.find(n => n.id === link.from)!;

    const line = new sd.Line({
        targetNode: svg,
        x1: fromNode.x,
        y1: fromNode.y,
        x2: fromNode.x,
        y2: fromNode.y,
        stroke: "#9E9E9E",
        strokeWidth: 2,
        opacity: 0,
    });
    linkMap[`${link.from}-${link.to}`] = line;
});

// 创建节点
nodesData.forEach(data => {
    const circle = new sd.Circle({
        targetNode: svg,
        cx: data.x,
        cy: data.y,
        r: 0,
        fill: nodeColor,
        stroke: nodeStroke,
        strokeWidth: 2,
    });

    const text = new sd.Text({
        targetNode: svg,
        text: data.label,
        fontSize: 20,
        fill: "#1565C0",
        x: data.x,
        y: data.y,
        opacity: 0,
    });
    text.setCenterX(data.x).setCenterY(data.y);

    nodeMap[data.id] = { circle, text };
});

sd.main(async () => {
    // 1. 标题入场
    title.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(500);

    // 2. 构建树
    const nodeA = nodeMap["A"];
    nodeA.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeA.text.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(300);

    // 生长第一层连线
    const linkAB = linkMap["A-B"];
    const linkAC = linkMap["A-C"];
    const dataB = nodesData.find(n => n.id === "B")!;
    const dataC = nodesData.find(n => n.id === "C")!;

    linkAB.setOpacity(1).startAnimate().setX2(dataB.x).setY2(dataB.y).endAnimate();
    linkAC.setOpacity(1).startAnimate().setX2(dataC.x).setY2(dataC.y).endAnimate();
    await sd.pause(300);

    // 显示 B, C
    const nodeB = nodeMap["B"];
    const nodeC = nodeMap["C"];
    nodeB.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeB.text.startAnimate().setOpacity(1).endAnimate();
    nodeC.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeC.text.startAnimate().setOpacity(1).endAnimate();
    await sd.pause(300);

    // 生长第二层连线
    const linkBD = linkMap["B-D"];
    const linkBE = linkMap["B-E"];
    const linkCF = linkMap["C-F"];
    const dataD = nodesData.find(n => n.id === "D")!;
    const dataE = nodesData.find(n => n.id === "E")!;
    const dataF = nodesData.find(n => n.id === "F")!;

    linkBD.setOpacity(1).startAnimate().setX2(dataD.x).setY2(dataD.y).endAnimate();
    linkBE.setOpacity(1).startAnimate().setX2(dataE.x).setY2(dataE.y).endAnimate();
    linkCF.setOpacity(1).startAnimate().setX2(dataF.x).setY2(dataF.y).endAnimate();
    await sd.pause(300);

    // 显示 D, E, F
    const nodeD = nodeMap["D"];
    const nodeE = nodeMap["E"];
    const nodeF = nodeMap["F"];
    nodeD.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeD.text.startAnimate().setOpacity(1).endAnimate();
    nodeE.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeE.text.startAnimate().setOpacity(1).endAnimate();
    nodeF.circle.startAnimate().setR(nodeRadius).endAnimate();
    nodeF.text.startAnimate().setOpacity(1).endAnimate();

    await sd.pause(1000);

    // 辅助函数
    const updateDesc = async (text: string) => {
        descText.startAnimate({ duration: 200 }).setOpacity(0).endAnimate();
        await sd.pause(200);
        descText.setText(text).setCenterX(600);
        descText.startAnimate({ duration: 200 }).setOpacity(1).endAnimate();
    };

    const highlightNode = (id: string, active: boolean) => {
        const n = nodeMap[id];
        n.circle
            .startAnimate()
            .setFill(active ? highlightColor : nodeColor)
            .setStroke(active ? highlightStroke : nodeStroke)
            .endAnimate();
    };

    const highlightLink = (from: string, to: string, active: boolean) => {
        const l = linkMap[`${from}-${to}`];
        if (l) {
            l.startAnimate()
                .setStroke(active ? highlightStroke : "#9E9E9E")
                .setStrokeWidth(active ? 4 : 2)
                .endAnimate();
        }
    };

    // 3. 树根
    await updateDesc("根节点 (Root): 树的顶部节点，没有父节点");
    highlightNode("A", true);
    await sd.pause();

    // 4. 父子
    highlightNode("A", false);
    await updateDesc("父节点 (Parent) & 子节点 (Child): 直接相连的节点");
    highlightNode("B", true);
    highlightNode("D", true);
    highlightLink("B", "D", true);
    await sd.pause();

    // 5. 祖先
    highlightNode("B", false);
    highlightNode("D", false);
    highlightLink("B", "D", false);

    await updateDesc("祖先 (Ancestor): 从节点向上到根的路径上的所有节点");
    highlightNode("E", true);
    await sd.pause(500);
    highlightLink("B", "E", true);
    highlightNode("B", true);
    await sd.pause(500);
    highlightLink("A", "B", true);
    highlightNode("A", true);
    await sd.pause();

    // 6. 后代
    highlightNode("E", false);
    highlightNode("B", false);
    highlightNode("A", false);
    highlightLink("B", "E", false);
    highlightLink("A", "B", false);

    await updateDesc("后代 (Descendant): 节点向下的所有子树节点");
    highlightNode("B", true);
    await sd.pause(500);
    highlightLink("B", "D", true);
    highlightLink("B", "E", true);
    highlightNode("D", true);
    highlightNode("E", true);
    await sd.pause();

    // 7. 深度
    highlightNode("B", false);
    highlightNode("D", false);
    highlightNode("E", false);
    highlightLink("B", "D", false);
    highlightLink("B", "E", false);

    await updateDesc("深度 (Depth): 节点到根节点的路径长度 (层级)");

    const levels = [
        { y: 150, label: "Depth 0" },
        { y: 300, label: "Depth 1" },
        { y: 450, label: "Depth 2" },
    ];

    for (const lvl of levels) {
        const line = new sd.Line({
            targetNode: svg,
            x1: 100,
            y1: lvl.y,
            x2: 1100,
            y2: lvl.y,
            stroke: "#CCC",
            strokeDashArray: "5,5",
            opacity: 0,
        });
        const txt = new sd.Text({
            targetNode: svg,
            text: lvl.label,
            x: 50,
            y: lvl.y,
            fontSize: 16,
            fill: "#888",
            opacity: 0,
        });
        txt.setCenterY(lvl.y);

        line.startAnimate().setOpacity(1).endAnimate();
        txt.startAnimate().setOpacity(1).endAnimate();
    }

    await sd.pause();
    await updateDesc("演示结束");
});
