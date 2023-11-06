
export function CenterOnly(parent, child) {
    return function() {
        let cx = parent.cx();
        let cy = parent.cy();
        child.cx(cx).cy(cy);
    }
}

export function CenterFixAspect(parent, child, rate = 1.2) {
    return function() {
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

export function Center(parent, child, rate = 1.2) {
    return function() {
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