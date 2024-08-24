import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).layerHeight(80).dx(20).dy(20);
const data = {
    1: { 
        hover: "你们来到了一座美丽偏僻的岛屿度假，到了晚上......",
        children: [
            { to: 2, condition: "你决定和Jimmy去沙滩逛逛" },
            { to: 3, condition: "你决定和Jane去森林走走" },
            { to: 4, condition: "你决定就留在营地"}
        ]
    },
    2: {
        hover: "沙滩上有一个被遗弃的小艇，似乎还能用",
        children: []
    },
    3: {
        hover: "森林中有一个诡异的山洞......",
        children: [
            { to: 5, condition: "你和Jane一起进去看看" },
            { to: 6, condition: "你决定回到营地把这件事汇报给大家" }
        ]
    },
    4: {
        hover: "你在营地度过了一个愉快的夜晚",
        children: []
    },
    5: {
        hover: "......",
        children: []
    },
    6: {
        hover: "......",
        children: []
    }
}

sd.init(() => {
    tree.root(1); init(1);
})

function init(x) {
    const node = tree.element(x);
    node.onClick(() => {
        node.onClick(() => {
            node.onClick(() => {});
            expand(x);
        });
        attachTitleTo(data[x].hover, node);
        node.color(C.green);
    });
}

function expand(x) {
    const children = data[x].children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const condition = child.condition;
        const to = child.to;
        tree.link(x, to);
        const link = tree.element(x, to).arrow();
        const rect = new sd.Box(link, i + 1).width(20).height(20);
        attachTitleTo(condition, rect);
        link.value(rect);
        init(to);
    }
    if (children.length === 0) {
        tree.color(x, C.orange);
    }
}

function attachTitleTo(titleText, element) {
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title"),
    text = document.createTextNode(titleText);
    title.appendChild(text);
    element.g().nake().appendChild(title);
}