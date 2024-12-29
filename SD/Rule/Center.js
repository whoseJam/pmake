
export function CenterOnly() {
    return function (parent, child) {
        const cx = parent.cx();
        const cy = parent.cy();
        child.cx(cx).cy(cy);
    }
}

export function CenterFixAspect(rate = 1.2) {
    return function (parent, child) {
        const cx = parent.cx(), w = parent.width();
        const cy = parent.cy(), h = parent.height()
        const cw = child.width(), kw = w / cw / rate;
        const ch = child.height(), kh = h / ch / rate;
        const k = Math.min(kw, kh);
        child.width(cw * k);
        child.height(ch * k);
        child.cx(cx).cy(cy);
    }
}

export function Center(rate = 1.2) {
    return function (parent, child) {
        const cx = parent.cx(), w = parent.width();
        const cy = parent.cy(), h = parent.height();
        const cw = w / rate;
        const ch = h / rate;
        child.width(cw).height(ch);
        child.x(cx - cw / 2);
        child.y(cy - ch / 2);
    }
}

export function TriangleCenterFixAspect(rate = 1.2) {
    return function (parent, child) {
        let width = parent.width();
        let height = parent.height();
        let cwidth = child.width();
        let cheight = child.height();
        if (cwidth === 0 || cheight === 0) {
            child.width(width / rate);
            child.height(height / rate);
            cwidth = child.width();
            cheight = child.height();
        }
        let k = cheight / cwidth;
        let x = height / (height / width + cheight / cwidth);
        child.width(x).height(k * x);
        let H = parent.height() * child.width() / parent.width();
        let y = parent.my() - H / 2;
        child.cx(parent.cx());
        child.my(parent.my());
    }
}