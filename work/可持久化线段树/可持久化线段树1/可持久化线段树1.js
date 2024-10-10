import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const segmentTrees = [];
const data = [0, 3, 2, 4, 1];
const n = 4;
let tot = 0;
let virtualTot = 100;
const treeNodes = sd.make1d(100, { lc: 0, rc: 0 });
const operator = [
    { op: "M", pos: 1, value: 1, gap: 300 },
    { op: "M", pos: 2, value: 3, gap: 200 },
    { op: "M", pos: 3, value: 2, gap: 100 },
    { op: "M", pos: 4, value: 3, gap: 100 },
];

sd.init(() => {
    build();
})

sd.main(async () => {
    for (let i = 0; i < operator.length; i++) {
        if (operator[i].op === "M") {
            await insert(operator[i].pos, operator[i].value);
        }
    }
    for (let i = 0; i < segmentTrees.length; i++)
        await query(i);
})

function findNodeById(nodeId) {
    for (let i = 0; i < segmentTrees.length; i++) {
        if (segmentTrees[i].findNodeById(nodeId)) {
            return segmentTrees[i].findNodeById(nodeId);
        }
    }
    return undefined;
}

async function query(v) {
    const tree = segmentTrees[v];
    const dfs = (x, l, r, col) => {
        if (!x) return;
        if (l === r) {
            findNodeById(x).startAnimate().color(col).endAnimate();
            return;
        }
        const mid = (l + r) >> 1;
        dfs(treeNodes[x].lc, l, mid, col);
        dfs(treeNodes[x].rc, mid + 1, r, col);
    }
    await sd.pause();
    tree.root().startAnimate().color(C.green).endAnimate();
    dfs(tree.rootId(), 1, n, C.green);
    await sd.pause();
    tree.root().startAnimate().color(C.white).endAnimate();
    dfs(tree.rootId(), 1, n, C.white);
}

function build() {
    const tree = new sd.BinaryTree(svg).layerHeight(130);
    segmentTrees.push(tree);
    tree.x(100).y(100);
    function dfsBuild(x, l, r) {
        const vertex = tree.element(x);
        if (l === r) {
            const text = new sd.Text(svg, `v=${data[l]}`);
            vertex.childAs("v", text, R.Aside("bc", 10));
            return;
        }
        const mid = (l + r) >> 1;
        treeNodes[x].lc = ++tot;
        tree.newNode(tot).leftChild(x, tot);
        vertex.leftChild = tree.element(tot);
        dfsBuild(tot, l, mid);
        treeNodes[x].rc = ++tot;
        tree.newNode(tot).rightChild(x, tot);
        vertex.rightChild = tree.element(tot);
        dfsBuild(tot, mid + 1, r);
    }
    tree.root(++tot);
    dfsBuild(1, 1, n);
    tree.update();
}

async function insert(pos, value) {
    const length = segmentTrees.length;
    const lastVersion = segmentTrees[length - 1];
    const tree = new sd.BinaryTree(svg).layerHeight(130);
    segmentTrees.push(tree);
    const index = segmentTrees.length - 1;
    let gapSum = 0;
    for (let i = 0; i < index; i++) gapSum += operator[i].gap; 
    tree.x(100 + gapSum).y(100);
    
    const dfsInsert = async function(x, lastx, l, r, pos, value) {
        console.log("x=", x, "lastx=", lastx, "tree=", treeNodes[lastx]);
        treeNodes[x].lc = treeNodes[lastx].lc;
        treeNodes[x].rc = treeNodes[lastx].rc;
        const vertex = tree.element(x);
        const lastVertex = findNodeById(lastx);

        if (l === r) {
            const text = new sd.Text(svg, `v=${value}`);
            vertex.childAs("v", text, R.Aside("bc", 10));
            text.opacity(0).startAnimate().opacity(1).endAnimate();
            return;
        }

        await sd.pause();
        const mid = (l + r) >> 1;
        if (pos <= mid) {
            tree.startAnimate().freeze();
            treeNodes[x].lc = ++tot;
            const rc = ++virtualTot;
            tree.newNode(tot);
            tree.leftChild(x, tot);
            tree.newNode(rc, treeNodes[lastx].rc);
            tree.rightChild(x, rc);
            vertex.leftChild = tree.element(tot);
            vertex.rightChild = tree.element(rc);
            vertex.rightChild.child("background").strokeDashArray([5, 5]).stroke(C.grey);
            tree.unfreeze().endAnimate();
            if (lastVertex && lastVertex.rightChild) {
                sd.Link(vertex.rightChild, lastVertex.rightChild, sd.Curve).stroke(C.red)
                    .startAnimate().pointStoT().endAnimate().arrow();
            }
            await dfsInsert(tot, treeNodes[lastx].lc, l, mid, pos, value);
        } else {
            tree.startAnimate().freeze();
            treeNodes[x].rc = ++tot;
            tree.newNode(tot);
            tree.rightChild(x, tot);
            vertex.leftChild = findNodeById(treeNodes[x].lc);
            vertex.rightChild = tree.element(tot);
            tree.unfreeze().endAnimate();
            if (lastVertex.leftChild) {
                sd.Link(vertex, lastVertex.leftChild).stroke(C.deepSkyBlue)
                    .startAnimate().pointStoT().endAnimate().arrow();
            }
            await dfsInsert(tot, treeNodes[lastx].rc, mid + 1, r, pos, value)
        }
    }
    const root = ++tot;
    await sd.pause();
    tree.startAnimate().root(root).endAnimate();
    await dfsInsert(root, lastVersion ? lastVersion.rootId() : undefined,  1, n, pos, value);
}