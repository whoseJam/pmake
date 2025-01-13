import * as sd from "@/sd";
import { LCA } from "../_/LCA";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600).layerHeight(50);
const px = sd.Pointer(tree, "x", "l", 3, 20);
const py = sd.Pointer(tree, "y", "r", 3, 20);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [5, 7],
    [7, 8],
    [7, 9],
    [8, 10],
    [9, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(300);
});

sd.main(async () => {
    // await myLCA(2, 17);
    await myLCA(10, 17);
});

async function myLCA(x, y) {
    const lca = await LCA(tree, x, y, {
        onLCA,
        onCheckJump,
        onJump,
        onCheckJumpTogether,
        onJumpTogether,
    });
    await sd.pause();
    tree.startAnimate().color(lca, C.orange).endAnimate();
    await sd.pause();
    px.startAnimate().moveTo(null).endAnimate();
    py.startAnimate().moveTo(null).endAnimate();
    tree.element(lca).startAnimate().color(C.white).endAnimate();
    tree.element(x).startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
    tree.element(y).startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
}

async function onLCA(x, y) {
    await sd.pause();
    if (tree.element(x).cx() < tree.element(y).cx()) {
        px.direction("r");
        py.direction("l");
    } else {
        px.direction("l");
        py.direction("r");
    }
    px.startAnimate().moveTo(x).endAnimate();
    py.startAnimate().moveTo(y).endAnimate();
    tree.element(x).startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    tree.element(y).startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
}

async function onCheckJump(x, kth) {
    await sd.pause();
    if (!global.lx) {
        global.lx = new sd.Curve(svg);
        shape(global.lx, x, kth);
        global.lx.startAnimate().pointStoT().endAnimate().arrow();
    } else {
        global.lx.startAnimate();
        shape(global.lx, x, kth);
        global.lx.endAnimate();
    }
}

async function onJump(x, kth) {
    await sd.pause();
    tree.startAnimate().color(kth, C.green).endAnimate();
    await sd.pause();
    global.lx.startAnimate().fadeStoT().endAnimate().remove();
    global.lx = undefined;
    px.startAnimate().moveTo(kth).endAnimate();
    tree.startAnimate().color(kth, C.white).endAnimate();
}

async function onCheckJumpTogether(x, kx, y, ky) {
    await sd.pause();
    if (!global.lx) {
        global.lx = new sd.Curve(svg);
        global.ly = new sd.Curve(svg);
        shape(global.lx, x, kx);
        shape(global.ly, y, ky);
        global.lx.startAnimate().pointStoT().endAnimate().arrow();
        global.ly.startAnimate().pointStoT().endAnimate().arrow();
    } else {
        global.lx.startAnimate();
        global.ly.startAnimate();
        shape(global.lx, x, kx);
        shape(global.ly, y, ky);
        global.lx.endAnimate();
        global.ly.endAnimate();
    }
}

async function onJumpTogether(x, kx, y, ky) {
    await sd.pause();
    tree.startAnimate().color(kx, C.green).color(ky, C.green).endAnimate();
    await sd.pause();
    if (global.lx) {
        global.lx.startAnimate().fadeStoT().endAnimate().remove();
        global.lx = undefined;
        global.ly.startAnimate().fadeStoT().endAnimate().remove();
        global.ly = undefined;
    }
    px.startAnimate().moveTo(kx).endAnimate();
    py.startAnimate().moveTo(ky).endAnimate();
    tree.startAnimate().color(kx, C.white).color(ky, C.white).endAnimate();
}

function shape(link, x, y) {
    const nx = tree.element(x);
    const ny = tree.element(y);
    if (nx.cx() < ny.cx()) link.bending(-0.5);
    else link.bending(0.5);
    link.source(nx.center());
    link.target(ny.center());
    sd.trim(link, nx, ny);
}

// async function LCA(x, y) {
//     let swapFlag = false;
//     if (dep[x] > dep[y]) {
//         let tmp = x;
//         x = y;
//         y = tmp;
//         swapFlag = true;
//     }
//     await sd.pause();
//     tree.startAnimate();
//     const oldX = x,
//         oldY = y;
//     tree.element(x).strokeWidth(3).stroke(C.red).endAnimate();
//     tree.element(y).strokeWidth(3).stroke(C.red).endAnimate();
//     tree.endAnimate();
//     const px = sd.Pointer(tree, swapFlag ? "x" : "y", "r");
//     const py = sd.Pointer(tree, swapFlag ? "y" : "x", "l");
//     px.startAnimate().moveTo(x).endAnimate();
//     py.startAnimate().moveTo(y).endAnimate();
//     const linkTo = (a, b) => {
//         const l = sd.Link(tree.element(a), tree.element(b), sd.Curve).bending(-0.5);
//         tree.element(a).update();
//         l.startAnimate().pointStoT().endAnimate().arrow();
//         return l;
//     };
//     for (let i = m - 1; i >= 0; i--) {
//         if (dep[fa[y][i]] >= dep[x]) {
//             await sd.pause();
//             const l = linkTo(y, fa[y][i]);
//             await sd.pause();
//             py.startAnimate().moveTo(fa[y][i]).endAnimate();
//             await sd.pause();
//             l.startAnimate().opacity(0).remove();
//             y = fa[y][i];
//         }
//     }
//     if (x !== y) {
//         for (let i = m - 1; i >= 0; i--) {
//             if (fa[x][i] === fa[y][i] && fa[x][i] !== 0) {
//                 await sd.pause();
//                 const ls = [linkTo(x, fa[x][i]), linkTo(y, fa[y][i])];
//                 await sd.pause();
//                 tree.startAnimate().color(fa[x][i], C.red).endAnimate();
//                 await sd.pause();
//                 ls.forEach(l => l.startAnimate().opacity(0).remove());
//                 tree.startAnimate().color(fa[x][i], C.white).endAnimate();
//             }
//             if (fa[x][i] !== fa[y][i]) {
//                 await sd.pause();
//                 const ls = [linkTo(x, fa[x][i]), linkTo(y, fa[y][i])];
//                 await sd.pause();
//                 px.startAnimate().moveTo(fa[x][i]).endAnimate();
//                 py.startAnimate().moveTo(fa[y][i]).endAnimate();
//                 await sd.pause();
//                 ls.forEach(l => l.startAnimate().opacity(0).remove());
//                 x = fa[x][i];
//                 y = fa[y][i];
//             }
//         }
//         await sd.pause();
//         px.startAnimate().moveTo(fa[x][0]).endAnimate();
//         x = fa[x][0];
//         py.startAnimate().moveTo(fa[y][0]).endAnimate();
//         y = fa[y][0];
//     }
//     await sd.pause();
//     tree.startAnimate().color(x, C.green).endAnimate();
//     await sd.pause();
//     px.startAnimate().opacity(0).remove();
//     py.startAnimate().opacity(0).remove();
//     tree.startAnimate();
//     tree.color(x, C.white);
//     tree.element(oldX).strokeWidth(1).stroke(C.black);
//     tree.element(oldY).strokeWidth(1).stroke(C.black);
//     tree.endAnimate();
// }
