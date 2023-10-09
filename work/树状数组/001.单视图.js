import { sd } from "#lib/slide";

let svg = sd.svg();

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

let tr = sd.Tree(svg).x(200).y(160)
    .width(923).height(294)
    .drag(true).resizeable(true);
tr.vertex_template()
    .define("fix_width", true)
    .define("fix_height", true)
    .define("*", (vertex) => {
        vertex.background().opacity(0);
        vertex.value().drag(true).resizeable(true);
    });
let id = 0;
let arr = [0, 1, 4, 2, 7, 5, 6, 3, 8];

main();

async function main() {
    let origin_arr = sd.Array(svg).hsj_push_array(arr, 1, 8)
        .x(100).y(100);
    await sd.pause();

    tr.start_animate();
    id = 0;
    await build(1, 8);
    tr.end_animate();

    id = 0;
    await rebuild(1, 8);
}

async function build(l, r, is_left = true, prt = "") {
    let a = sd.Array(tr).hsj_push_array(arr, l, r).start_from(l);
    if (is_left) index_array(a);
    let myid = String(++id);
    tr.link({ parent: prt, id: myid, value: a });
    if (!is_left) tr.vertex_element(myid).opacity(0);
    if (l === r) return;
    let mid = Math.floor((l + r) / 2);
    await build(l, mid, true, myid);
    await build(mid + 1, r, false, myid);
}

function switch_value(id, val) {
    let cx = tr.vertex(id).cx();
    let cy = tr.vertex(id).cy();
    tr.vertex(id)
        .fix_width(false)
        .fix_height(false)
        .cx(cx).cy(cy)
        .start_animate()
        .opacity(0)
        .cx(cx).cy(cy)
        .end_animate()
        .width(40)
        .value(val)
        .cx(cx).cy(cy)
        .start_animate()
        .opacity(1)
        .cx(cx).cy(cy)
        .end_animate();
}

async function rebuild(l, r, is_left = true) {
    let myid = String(++id);
    let sum = 0;
    for (let i = l; i <= r; i++) sum += arr[i];
    if (l === r) {
        if (is_left) {
            await sd.pause();
            switch_value(myid, sd.Text(svg, sum));
        }
        return sum;
    }

    let mid = Math.floor((l + r) / 2);
    let L = await rebuild(l, mid, true);
    let R = await rebuild(mid + 1, r, false);
    sum = L + R;

    if (is_left) {
        await sd.pause();
        switch_value(myid, sd.Text(svg, sum));
    }
    return sum;
}