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
board.x(500);
board.y(300);
board.font_size(40);

let lines = [
    [1, 2, 4],
    [2, 4, 2],
    [1, 6, 6],
    [4, 1, 5],
    [5, 6, 3],
    [2, 5, 1],
    [3, 5, 7]
];

for (let i = 0; i < lines.length; i++) {
    let x = lines[i][0];
    let y = lines[i][1];
    g.link({
        source: x,
        target: y,
        value: new Text(g._group, String(lines[i][2]))
    });
}


const kruskal = () => {
    lines.sort((a, b) => {
        return a[2] - b[2];
    })
    for (let i = 0; i < lines.length; i++) {
        let x = lines[i][0];
        let y = lines[i][1];
        pause(() => {
            board.text("Check Line x = " + String(x) + " y = " + String(y));
            g.get_line(x, y).line_handle.stroke(Color.red, S);
            g.get_node(x).node_handle.color(Color.red_pack, S);
            g.get_node(y).node_handle.color(Color.red_pack, S);
        });
        pause(() => {
            let fx = get_fa(x);
            let fy = get_fa(y);
            if (fx !== fy) {
                fa[fx] = fy;
                g.get_line(x, y).line_handle.stroke(Color.green, S);
            } else g.get_line(x, y).line_handle.stroke(Color.grey, S);
            g.get_node(x).node_handle.color(Color.default_pack, S);
            g.get_node(y).node_handle.color(Color.default_pack, S);
        })
    }
}
kruskal();