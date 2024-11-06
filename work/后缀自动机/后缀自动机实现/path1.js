import * as sd from "@/sd";
import { SuffixMachine } from "../动画库/SuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(100);
const str = "abaab";
const arr = new sd.Array(svg).pushArray(str).cx(280).y(graph.my() + 80);
const MAXC = 2;
const [fa, ch, len, tot] = SuffixMachine(str);

sd.init(() => {
    graph.at(0, 0).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(0, 1).newNode(3);
    graph.at(0.5, 1).newNode(4);
    graph.at(1, 0).newNode(5);
    graph.at(1, 1).newNode(6);

    for (let i = 1; i <= tot; i++) {
        for (let v = 0; v < MAXC; v++) {
            if (ch[i][v]) {
                graph.newLink(i, ch[i][v]);
                graph.element(i, ch[i][v]).arrow();
                const rule = (graph.element(i, ch[i][v]).width() <= 5) ? R.pointAtPathByRate(0.5, "x", "cy") : R.pointAtPathByRate(0.5, "cx", "my");
                graph.element(i, ch[i][v]).value(String.fromCharCode(v + "a".charCodeAt(0)), rule);
            }
        }
    }

    tree.root(1);
    for (let i = 2; i <= tot; i++) {
        tree.link(fa[i], i);
        tree.element(fa[i], i).arrow();
    }
    for (let i = 2; i <= tot; i++) {
        const location = (tree.element(i).cx() < tree.element(fa[i]).cx() ? "lt" : "rt");
        const stk = sd.Aside(tree.element(i), new sd.ValueStack(svg), location);
        stk.align("mx").elementHeight(20);
        tree.element(i).stack = stk;
    }
    for (let u = 2; u <= tot; u++) {
        const paths = [];
        SearchTo(1, u, [1], paths);
        paths.sort((pathA, pathB) => {
            return pathA.length - pathB.length;
        });
        for (let i = 0; i < paths.length; i++) {
            let pathStr = "";
            for (let j = 0; j < paths[i].length - 1; j++)
                pathStr = pathStr + graph.text(paths[i][j], paths[i][j + 1]);
            tree.element(u).stack.push(pathStr);
        }
    }
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().push("c").color(arr.end(), C.blue).endAnimate();

    await sd.pause();
    const lst = 6;
    const cur = 7;
    const last = sd.Pointer(graph, "last", "t", 5, 20, 5);
    last.startAnimate().moveTo(lst).endAnimate();
    graph.startAnimate().color(lst, C.green);

    await sd.pause();
    graph.startAnimate().at(0.5, 2).newNode(cur).endAnimate();
    sd.Label(graph.element(cur), str + "c", "bc", 20, 5).opacity(0).startAnimate().opacity(1).endAnimate();
    
    await sd.pause();
    [6, 3, 1].forEach(id => {
        tree.startAnimate().color(id, C.green).endAnimate();
        graph.newLink(id, cur);
        const link = graph.element(id, cur);
        link.startAnimate();
        link.pointStoT();
        if (id === 3) link.value("c", R.pointAtPathByRate(0.5, "x", "my"));
        if (id === 6) link.value("c", R.pointAtPathByRate(0.5, "x", "y"));
        link.endAnimate().arrow();
        
        graph.startAnimate();
        graph.color(id, C.green);
        graph.endAnimate();
    })
    await sd.pause();
    const v = new sd.Vertex(tree, cur);
    v.x(tree.element(3).mx() + 80).cy(tree.element(3).cy());
    v.opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Link(tree.element(1), v).startAnimate().pointStoT().endAnimate().arrow();

    await sd.pause();
    const paths = ["c", "bc", "abc", "aabc", "baabc", "abaabc"];
    v.stack = sd.Aside(v, new sd.ValueStack(svg).elementHeight(20).align("mx"), "rt");
    v.stack.startAnimate();
    for (let i = 0; i < paths.length; i++)
        v.stack.push(paths[i]);
    v.stack.endAnimate();
})

function SearchTo(u, target, path, paths) {
    if (u === target) {
        paths.push([...path]);
        return;
    }
    for (let i = 0; i < MAXC; i++) {
        if (ch[u][i]) {
            path.push(ch[u][i]);
            SearchTo(ch[u][i], target, path, paths);
            path.pop();
        }
    }
}