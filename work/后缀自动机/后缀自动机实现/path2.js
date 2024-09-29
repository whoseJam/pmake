import * as sd from "@/sd";
import { SuffixMachine } from "../动画库/SuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(100);
const str = "abaab";
const arr = new sd.Array(svg).pushArray(str).cx(180).y(graph.my() + 80);
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
                const rule = (graph.element(i, ch[i][v]).width() <= 5) ? R.PointAtPathByRate(0.5, "x", "cy") : R.PointAtPathByRate(0.5, "cx", "my");
                graph.element(i, ch[i][v]).value(String.fromCharCode(v + "a".charCodeAt(0)), rule);
            }
        }
    }

    tree.root(1);
    for (let i = 2; i <= tot; i++) {
        tree.link(fa[i], i);
        tree.element(fa[i], i).arrow();
    }
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
    const lst = 6;
    const cur = 7;
    const last = sd.Pointer(graph, "last", "t", 5, 20, 5);
    last.startAnimate().moveTo(lst).endAnimate();
    graph.startAnimate().color(lst, C.green);

    await sd.pause();
    arr.startAnimate().push("a").color(arr.end(), C.blue).endAnimate();

    await sd.pause();
    graph.startAnimate().at(0.5, 2).newNode(cur).endAnimate();
    sd.Label(graph.element(cur), str + "a", "bc", 20, 5).opacity(0).startAnimate().opacity(1).endAnimate();
    
    await sd.pause();
    [6, 3].forEach(id => {
        tree.startAnimate().color(id, id === 3 ? C.red : C.green).endAnimate();
        graph.newLink(id, cur);
        const link = graph.element(id, cur);
        link.startAnimate();
        link.pointStoT();
        if (id === 3) link.value("a", R.PointAtPathByRate(0.5, "x", "my")).opacity(0.2);
        if (id === 6) link.value("a", R.PointAtPathByRate(0.5, "x", "y"));
        link.endAnimate().arrow();
        
        graph.startAnimate();
        graph.color(id, id === 3 ? C.red : C.green);
        graph.endAnimate();
    });

    await sd.pause();
    graph.element(3, 4).stroke(C.red).strokeWidth(3).arrow(null).startAnimate().pointStoT().endAnimate().arrow();
    const stk = tree.element(3).stack;
    sd.Label(stk.element(0), "a", "rc", 20, 0).color(C.red).opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Label(stk.element(1), "a", "rc", 20, 0).color(C.red).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    graph.startAnimate().color(4, C.orange).endAnimate();
    tree.startAnimate().color(4, C.orange).endAnimate();

    await sd.pause();
    tree.startAnimate();
    tree.link(4, 7);
    tree.element(4, 7).pointStoT();
    tree.endAnimate();
    tree.element(4, 7).arrow();

    await sd.pause();
    const paths = ["aaba", "baaba", "abaaba"];
    const stack = sd.Aside(tree.element(cur), new sd.ValueStack(svg).elementHeight(20).align("mx"), "rt", 20);
    stack.startAnimate();
    for (let i = 0; i < paths.length; i++)
        stack.push(paths[i]);
    stack.endAnimate();
})