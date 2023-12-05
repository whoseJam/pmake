
export function CenterOnly() {
    return function(parent, child) {
        let cx = parent.cx();
        let cy = parent.cy();
        child.cx(cx).cy(cy);
    }
}

export function CenterFixAspect(rate = 1.2) {
    return function(parent, child) {
        let cx = parent.cx();
        let cy = parent.cy();
        let width = parent.width();
        let height = parent.height();
        let k = 1;
        let cwidth = child.width();
        let cheight = child.height();
        if (cwidth === 0 || cheight === 0) {
            child.width(width / rate);
            child.height(height / rate);
            cwidth = child.width();
            cheight = child.height();
        }
        let rw = cwidth / width;
        let rh = cheight / height;
        if (rw > rh) k = width / rate / cwidth;
        else         k = height / rate / cheight;
        child.width(cwidth * k);
        child.height(cheight * k);
        child.cx(cx);
        child.cy(cy);
    }
}

export function Center(rate = 1.2) {
    return function(parent, child) {
        let cx = parent.cx();
        let cy = parent.cy();
        let width = parent.width();
        let height = parent.height();
        child.width(width / rate);
        child.height(height / rate);
        child.cx(cx);
        child.cy(cy);
    }
}

export function TriangleCenterFixAspect(rate = 1.2) {
    return function(parent, child) {
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