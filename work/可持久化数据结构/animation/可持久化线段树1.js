import * as sd from "@/sd";

const svg = sd.svg();
const layer = svg.append("g");
const C = sd.color();
const R = sd.rule();
const versions = [];
const data = [0, 3, 2, 4, 1];
const n = 4;
let tot = 0;
const operator = [
    { op: "M", pos: 1, value: 1, gap: 300 },
    { op: "M", pos: 2, value: 3, gap: 160 },
    { op: "M", pos: 3, value: 2, gap: 160 },
    { op: "M", pos: 4, value: 3, gap: 160 },
];

init();
main();

function init() {
    build();
}

async function main() {
    for (let i = 0; i < operator.length; i++) {
        if (operator[i].op === "M") {
            await insert(operator[i].pos, operator[i].value);
        }
    }
    for (let i = 0; i < versions.length; i++)
        await query(i);
    await sd.pause();
}

function findNodeById(nodeId) {
    for (let i = 0; i < versions.length; i++) {
        if (versions[i].findNodeById(nodeId)) {
            return versions[i].findNodeById(nodeId);
        }
    }
    return undefined;
}

async function query(v) {
    const tree = versions[v];
    const dfs = (x, l, r, col) => {
        if (!x) return;
        if (l === r) {
            findNodeById(x).startAnimate().color(col).endAnimate();
            return;
        }
        const mid = (l + r) >> 1;
        dfs(findNodeById(x).leftChild, l, mid, col);
        dfs(findNodeById(x).rightChild, mid + 1, r, col);
    }
    await sd.pause();
    tree.root().startAnimate().color(C.green).endAnimate();
    dfs(tree.root().nodeId, 1, n, C.green);
    await sd.pause();
    tree.root().startAnimate().color(C.white).endAnimate();
    dfs(tree.root().nodeId, 1, n, C.white);
}

function build() {
    const tree = new sd.BinaryTree(svg).layerHeight(130);
    versions.push(tree);
    const rk = versions.length;
    tree.x(100).y(100);
    const dfsBuild = (fa, childType, l, r) => {
        console.log("fa=", fa, "cur=", tot + 1, "childType=", childType);
        if (!fa) tree.root(++tot);
        else tree.newNode(++tot)[childType](fa, tot);
        const vertex = tree.element(tot);
        if (l === r) {
            const text = new sd.Text(svg, `v=${data[l]}`);
            vertex.childAs("v", text, R.Aside("bc", 10));
            return;
        }
        const mid = (l + r) >> 1;
        const id = tot;
        vertex.leftChild = tot + 1;
        dfsBuild(id, "leftChild", l, mid);
        vertex.rightChild = tot + 1;
        dfsBuild(id, "rightChild", mid + 1, r);
    }
    dfsBuild(0, undefined, 1, n);
    tree.update();
}

async function insert(pos, value) {
    const length = versions.length;
    const lastVersion = length > 0 ? versions[length - 1] : undefined;
    const tree = new sd.BinaryTree(svg).layerHeight(130);
    versions.push(tree);
    const rk = versions.length - 1;
    let gapSum = 0;
    for (let i = 0; i < rk; i++) gapSum += operator[i].gap; 
    tree.x(100 + gapSum).y(100);

    const realX = (rank, gap, depth) => tree.x() + (rank * 2 + 1) * gap;
    const realY = (rank, gap, depth) => tree.y() + tree.layerHeight() * depth;

    const dfsInsert = async function(fa, childType, lastx, l, r, pos, value, gap, rank, depth) {
        await sd.pause();
        if (!fa) tree.startAnimate().root(++tot).endAnimate();
        else tree.startAnimate().newNode(++tot)[childType](fa, tot).endAnimate();

        const vertex = tree.element(tot);

        if (l === r) {
            const text = new sd.Text(svg, `v=${value}`);
            vertex.childAs("v", text, R.Aside("bc", 10));
            tree.update();
            text.opacity(0).startAnimate().opacity(1).endAnimate();
            return;
        }

        const mid = (l + r) >> 1;
        const id = tot;

        const lastVertex = findNodeById(lastx);
        if (lastVertex) {
            if (pos <= mid) {
                await sd.pause();
                vertex.leftChild = tot + 1;
                vertex.rightChild = lastVertex.rightChild;
                const lastRightChild = findNodeById(lastVertex.rightChild);
                if (lastRightChild) {
                    const path = new sd.Path(layer).d(
                        `M ${vertex.cx()} ${vertex.cy()}
                         Q ${realX(rank*2+1, gap/2, depth+1)} ${realY(rank*2+1, gap/2, depth+1)} ${lastRightChild.cx()} ${lastRightChild.cy()}`
                    );
                    // await sd.pause();
                    path.opacity(0).stroke(C.red).startAnimate().opacity(1).endAnimate();
                }
                await dfsInsert(id, "leftChild", lastVertex.leftChild, l, mid, pos, value, gap/2, rank*2, depth+1);
                return;
            } else if (pos > mid){
                await sd.pause();
                vertex.leftChild = lastVertex.leftChild;
                vertex.rightChild = tot + 1;
                const lastLeftChild = findNodeById(lastVertex.leftChild);
                if (lastLeftChild) {
                    // await sd.pause();
                    sd.Link(vertex, lastLeftChild).opacity(0).stroke(C.deepSkyBlue).startAnimate().opacity(1).endAnimate();
                }
                await dfsInsert(id, "rightChild", lastVertex.rightChild, mid + 1, r, pos, value, gap/2, rank*2+1, depth+1);
                return;
            }
        }
        if (pos <= mid) {
            vertex.leftChild = tot + 1;
            await dfsInsert(id, "leftChild", undefined, l, mid, pos, value, gap/2, rank*2, depth+1);
        } else {
            vertex.rightChild = tot + 1;
            await dfsInsert(id, "rightChild", undefined, mid + 1, r, pos, value, gap/2, rank*2+1, depth+1);
        }
    }
    await dfsInsert(0, undefined, lastVersion ? lastVersion.root().nodeId : undefined, 
        1, n, pos, value,
        tree.width(), 0, 1);
}