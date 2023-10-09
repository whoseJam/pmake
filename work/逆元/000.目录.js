import * as sd from "#lib/slide";
import { trim } from "#lib/utility/trim"

let svg = sd.svg();
let C = sd.color();

main();

async function main() {
    await sd.pause();
    let op = sd.Array(svg)
        .push(sd.Text(svg, "运算").font_size(30))
        .push(null)
        .drag(true).resizeable(true).x(8).y(159).width(175).height(190);
    let cd = sd.Code(svg).code(`单位元
逆元`).font_size(20).drag(true).x(116).y(236);
    let add_op = site("加法运算", 300, 50);
    let mul_op = site("乘法运算", 300, 350);
    let mod_op = site("模运算", 300, 200);
    let strange_op = site("自定义运算", 300, 500)
    let mod_detail = site("模运算中的乘法运算", 600, 300);
    let mod_inv = site("乘法逆元", 600, 400);
    let fm_th = site("费马小定理", 600, 500);
    let linear_inv = site("线性推逆元", 937, 500);
    link(op, add_op);
    link(op, mul_op);
    link(op, mod_op);
    link(op, strange_op);
    link(mod_op, mod_detail);
    link(mod_detail, mod_inv);
    link(mod_inv, fm_th);
    link(mod_inv, linear_inv);
}

function site(str, x, y) {
    let box = sd.Box(svg).x(x).y(y).rate(1.5);
    box.value(sd.Text(box, str).font_size(30));
    box.drag(true).fix_width(true).fix_height(true);
    return box;
}

function link(site1, site2) {
    let lnk = sd.Link(svg).arrow(true);
    function update() {
        lnk.source(site1.cx(), site1.cy());
        lnk.target(site2.cx(), site2.cy());
        trim(lnk, site1, site2);
    }
    site1.listen("onX", update);
    site1.listen("onY", update);
    site1.listen("onWidth", update);
    site1.listen("onHeight", update);
    site2.listen("onX", update);
    site2.listen("onY", update);
    site2.listen("onWidth", update);
    site2.listen("onHeight", update);
    update();
}