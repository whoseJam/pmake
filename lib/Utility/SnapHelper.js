import { timeout } from "d3";

export const SnapHelper = {
    attr: attr,
    animate: animate,
    action: action,
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

function action(conf) {
    let elem = conf.elem;
    let action = {};
    action.startStamp = conf.start;
    action.endStamp = conf.end;
    action.channel = conf.key;
    action.frame = window.__frame__;
    action.value = conf.value;
    let duration = conf.end - conf.start;
    let args = {}, anim = null;
    args[conf.key] = conf.value;
    action.start = function() {
        if (this.startStamp === this.endStamp) elem.attr(args);
        else anim = elem.animate(args, duration, mina.easeinout);
    };
    action.stop = function(stopBy) {
        if (anim) anim.stop();
    }
    return action;
}