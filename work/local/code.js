
export function highlight(code, rct, l, r) {
    let el = code.row(l);
    let er = code.row(r);
    rct.x(el.x()).width(code.width())
       .y(el.y()).height(er.my() - el.y());
}