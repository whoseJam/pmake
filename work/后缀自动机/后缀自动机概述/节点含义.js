import * as sd from "@/sd";
import { SuffixMachine } from "../动画库/SuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(150);
const str = "abaab";
const arr = new sd.Array(svg).pushArray(str).cx(300).y(graph.my() + 80);
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
    const focus = sd.Focus(svg);
    for (let u = 2; u <= tot; u++) {
        const stk = tree.element(u).stack;
        await sd.pause();
        graph.startAnimate().color(u, C.blue).endAnimate();
        tree.startAnimate().color(u, C.blue).endAnimate();
        arr.startAnimate();
        const braces = [];
        findAllRightPosition(str, stk.element(0).text()).forEach(pos => {
            arr.color(pos, C.red);
            braces.push(sd.Brace(arr));
            braces[braces.length - 1].rightPos = pos;
        });
        arr.endAnimate();
        for (let i = 0; i < stk.length(); i++) {
            await sd.pause();
            focus.startAnimate().focus(stk.element(i)).endAnimate();
            braces.forEach(brace => {
                brace.startAnimate().brace(brace.rightPos - stk.element(i).text().length + 1, brace.rightPos).endAnimate();
            })
        }
        await sd.pause();
        sd.Aside(tree.element(u), createEndposSet(findAllRightPosition(str, stk.element(0).text())), "tc", 15).opacity(0).startAnimate().opacity(1);
        await sd.pause();
        graph.startAnimate().color(u, C.white).endAnimate();
        tree.startAnimate().color(u, C.white).endAnimate();
        arr.startAnimate().color(C.white).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
        braces.forEach(brace => {
            brace.startAnimate().opacity(0).remove();
        })
    }
})

function findAllRightPosition(str, substr) {
    const pos = [];
    for (let i = 0; i + substr.length <= str.length; i++) {
        if (str.slice(i, i + substr.length) === substr) {
            pos.push(i + substr.length - 1);
        }
    }
    return pos;
}

function createEndposSet(positions) {
    const arr = new sd.Array(svg).elementWidth(10).elementHeight(10).resize(str.length);
    positions.forEach(pos => arr.color(pos, C.red));
    return arr;
}