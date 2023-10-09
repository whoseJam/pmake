import { timeout } from "d3";

export const SnapHelper = {
    pushMatrix: pushMatrix,
    animate: animate,
    attr: attr,
};

function animate(elem, name, value, start, end) {
    let args = {};
    args[name] = value;
    if (start === 0) {
        elem.animate(args, end - start, mina.easeinout);
        return;
    }
    timeout(() => {
        elem.animate(args, end - start, mina.easeinout);
    }, start);
}

function attr(elem, name, value, start) {
    let args = {};
    args[name] = value;
    if (start === 0) {
        elem.attr(args);
        return;
    }
    timeout(() => {
        elem.animate(args);
    });
}

function pushMatrix(a, b) {
    let a1 = a.a, b1 = a.b, c1 = a.c, d1 = a.d, e1 = a.e, f1 = a.f;
    let a2 = b.a, b2 = b.b, c2 = b.c, d2 = b.d, e2 = b.e, f2 = e.f;
    let a3 = a1*a2 + c1*b2;
    let b3 = b1*a2 + d1*b2;
    let c3 = a1*c2 + c1*d2;
    let d3 = b1*c2 + d1*d2;
    let e3 = a1*e2 + c1*f2 + e1;
    let f3 = b1*e2 + d1*f2 + f1;
    a.a = a3; a.b = b3; a.c = c3;
    a.d = d3; a.e = e3; a.f = f3;
    return a;
}