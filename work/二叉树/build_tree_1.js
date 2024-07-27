import { sd } from "@/sd";

let svg = sd.svg();
let pos = 0;
let C = sd.Color;
let seq = "ABD..EF..G..C..";
let arr = sd.Array(svg)
    .hsj_push_array(seq)
    .drag(true)
    .start_from(0)
    .y(300);
let cnt = 0;

function create_func_call(char, id) {
    let arr = sd.Array(svg);
    arr.resize(3).start_from(1);

    let grid = sd.Grid(svg).n(2).m(2).start_n(1).start_m(1);
    grid.value(1, 1, sd.Text(grid, char));
    grid.value(2, 1, sd.Text(grid, id));
    grid.value(1, 2, sd.Text(grid, "lc=0"));
    grid.value(2, 2, sd.Text(grid, "rc=0"));
    grid.element(1, 1).bound().stroke_opacity(0);
    grid.element(1, 2).bound().stroke_opacity(0);
    grid.element(2, 1).bound().stroke_opacity(0);
    grid.element(2, 2).bound().stroke_opacity(0);
    console.log(arr);
    arr .element_width(400)
    console.log(arr);
    arr .element_height(200)
    console.log(arr);
    arr .element(1).value(grid);
    
    return arr;
}

function LCRC(lc = 0, rc = 0) {
    return sd.Text("lc=" + lc + " rc=" + rc);
}

async function build(prt, at) {
    await sd.pause();
    
    arr.start_animate()
    if (pos - 1 >= 0) arr.color(pos - 1, C.white);
    arr.color(pos, C.red);
    arr.end_animate();

    await sd.pause();
    let ch = seq[pos]; pos++;

    if (ch != ".") {
        let id = ++cnt;
        let box = create_func_call(ch, id);

        if (prt) {
            prt.value(at, box);
        }

        let lc = await build(box, 2);
        box .value(1)
            .value(1, 2, sd.Text(svg, "lc=" + lc));
        await sd.pause();

        let rc = await build(box, 3);
        box .value(1)
            .value(2, 2, sd.Text(svg, "rc=" + rc));
        await sd.pause();

        return id;
    } else return 0;
}

build();