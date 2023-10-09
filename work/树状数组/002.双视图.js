import { sd } from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

function index_array(array) {
    let l = array.length();
    let start = array.start_from();
    for (let i = 0; i < l; i++) {
        let id = start + i;
        let txt = sd.Text(array, id).font_size(10);
        let element = array.element(id);
        let update = () => {txt.cx(element.cx()).y(element.y() - 10); };
        array.listen("onX", update);
        array.listen("onY", update);
        array.listen("on_remove", () => { txt.remove(); });
        update();
    }
}

let tr1 = sd.Tree(svg).x(200).y(160)
    .width(923).height(294)
    .drag(true).resizeable(true);
let tr2 = sd.Tree(svg).x(200).y(350)
    .width(923).height(294)
    .drag(true).resizeable(true);
tr1.vertex_template()
    .define("fix_width", true)
    .define("fix_height", true)
    .define("*", (vertex) => {
        vertex.background().opacity(0);
        vertex.value().drag(true).resizeable(true);
    });
let id = 0;
let arr = [0, 1, 4, 2, 7, 5, 6, 3, 8];
let focus1 = [], focus2 = [];
let id_dict = {};

main();

async function main() {
    let origin_arr = sd.Array(svg).hsj_push_array(arr, 1, 8)
        .x(100).y(100);
    await sd.pause();

    id = 0;
    tr1.start_animate();
    await build1(1, 8);
    tr1.end_animate();

    await sd.pause();

    id = 0;
    tr2.start_animate();
    await build2(1, 8);
    tr2.end_animate();

    let board = sd.Text(svg)
        .drag(true).resizeable(true)
        .x(20).y(300);
    
    let cur = 1;
    while (true) {
        await sd.pause();
        board.text("i=" + cur);
        await sd.pause();
        query(cur);
        console.log(focus1, focus2);
        for (let i = 0; i < focus1.length; i++) {
            focus1[i].start_animate();
            focus1[i].value().color(C.red);
            focus1[i].end_animate();
            focus2[i].start_animate();
            focus2[i].color(C.green);
            focus2[i].end_animate();
        }
        await sd.pause();
        for (let i = 0; i < focus1.length; i++) {
            focus1[i].start_animate();
            focus1[i].value().color(C.white);
            focus1[i].end_animate();
            focus2[i].start_animate();
            focus2[i].color(C.white);
            focus2[i].end_animate();
        }
        await sd.pause();
        focus1 = [];
        focus2 = [];
        cur = (cur % 8 + 1);
    }
}

function encode(l, r) {
    return String(l) + "%%" + String(r);
}

async function build1(l, r, is_left = true, prt = "") {
    let a = sd.Array(tr1).hsj_push_array(arr, l, r).start_from(l);
    if (is_left) index_array(a);
    let myid = String(++id);
    tr1.link({ parent: prt, id: myid, value: a });
    if (!is_left) tr1.vertex_element(myid).opacity(0);
    id_dict[encode(l, r)] = myid;
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build1(l, mid, true, myid);
    await build1(mid + 1, r, false, myid);
}

async function build2(l, r, is_left = true, prt = "") {
    let myid = String(++id);
    let sum = 0;
    for (let i = l; i <= r; i++) sum += arr[i];
    if (l === r) {
        tr2.link({ parent: prt, id: myid, value: sd.Text(tr2, sum) });
        if (!is_left) tr2.vertex_element(myid).opacity(0);
        return sum;
    }

    tr2.link({ parent: prt, id: myid });

    let mid = Math.floor((l + r) / 2);
    let L = await build2(l, mid, true, myid);
    let R = await build2(mid + 1, r, false, myid);
    sum = L + R;

    let ele = tr2.vertex_element(myid);
    let txt = sd.Text(tr2, sum)
        .cx(ele.cx()).cy(ele.cy());
    ele.value(txt);
    if (!is_left) tr2.vertex_element(myid).opacity(0);

    return sum;
}

function query(i) {
    while (i > 0) {
        let lowbit = i & (-i);
        let l = i - lowbit + 1;
        let r = i;
        let id = id_dict[encode(l, r)];
        focus1.push(tr1.vertex_element(id));
        focus2.push(tr2.vertex_element(id));
        i -= lowbit;
    }
}