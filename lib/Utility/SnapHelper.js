import { timeout } from "d3";

export const SnapHelper = {
    attr: attr,
    animate: animate,
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
