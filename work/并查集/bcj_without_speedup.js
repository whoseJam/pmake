import { Util, Anitype, Text, Array, Graph, Color } from "#lib/slide";

let svg = Util.svg();
let pause = Util.pause;
let pause_append = Util.pause_append;
let S = Anitype.start;
let A = Anitype.append;


const create_1d = (len) => {
    let ans = [];
    for (let i = 0; i < len; i++)
        ans.push(0);
    return ans;
}

const get_fa = (x) => {
    if (fa[x] === x) return x;
    let ans = get_fa(fa[x]);
    return ans;
}

const merge = (x, y) => {
    pause(() => {
        board.text("Merge x=" + String(x) + " y=" + String(y));
        g.get_node(x).node_handle.color(Color.green_pack, S);
        if (x !== y) g.get_node(y).node_handle.color(Color.green_pack, S);
    })
    let fx = get_fa(x);
    let fy = get_fa(y);
    if (fx !== fy) {
        fa[fx] = fy;
        pause(() => {
            g.get_node(fx).node_handle.color(Color.red_pack, S);
            g.get_node(fy).node_handle.color(Color.red_pack, S);
        })
        pause(() => {
            g.link({
                source: fx,
                target: fy,
                arrow: true
            });
        })
        pause(() => {
            g.get_node(x).node_handle.color(Color.default_pack, S);
            if (x !== y) g.get_node(y).node_handle.color(Color.default_pack, S);
            g.get_node(fx).node_handle.color(Color.default_pack, S);
            g.get_node(fy).node_handle.color(Color.default_pack, S);
        })
    } else {
        pause(() => {
            g.get_node(fx).node_handle.color(Color.red_pack, S);
        })
        pause(() => {
            g.get_node(x).node_handle.color(Color.default_pack, S);
            if (x !== y) g.get_node(y).node_handle.color(Color.default_pack, S);
            g.get_node(fx).node_handle.color(Color.default_pack, S);
        })
    }
    pause_append(() => {
        board.text("Merge Finished");
    })
} 

let g = new Graph(svg);
let fa = create_1d(100);
let n = 6;
let board = new Text(svg);

for (let i = 1; i <= n; i++) {
    fa[i] = i;
    g.node({id: i, value: new Text(g._group, String(i))});
}
g.cx(200);
g.cy(300);
board.x(600);
board.y(300);
board.font_size(50);

let merges = [
    [1, 2],
    [3, 4],
    [1, 3],
    [3, 2],
    [5, 4],
    [4, 3],
    [1, 6]
];

for (let i = 0; i < merges.length; i++) {
    let x = merges[i][0];
    let y = merges[i][1];
    merge(x, y);
}