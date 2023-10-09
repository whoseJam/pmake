
function fs2width(fs) {
    return Math.max(1, fs / 12);
}

export function Superscript(parent, sup) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        sup.fontSize(fs);
        sup.x(last.supX);
        sup.cy(last.supY);
        last.supX = last.midX = sup.mx();
    }
}

export function Subscript(parent, sub) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        sub.fontSize(fs * 0.5);
        sub.x(last.subX);
        sub.cy(last.subY);
        last.subX = last.midX = sub.mx();
    }
}

export function Frac(parent, sup, sub, line) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        sup.fontSize(fs * 0.6);
        sub.fontSize(fs * 0.6);
        let len = Math.max(sup.width(), sub.width());
        let cy = last.midY;
        line.x(last.midX).y(cy);
        line.strokeWidth(fs2width(fs));
        line.width(len);
        sup.cx(line.cx()).cy(cy - fs * 0.4);
        sub.cx(line.cx()).cy(cy + fs * 0.4);
        last.midX = last.subX = last.supX = line.mx();
    }
}

export function Next(parent, cur) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        cur.fontSize(fs);
        cur.x(last.midX);
        cur.cy(last.midY);
        last.midX = last.supX = last.subX = cur.mx();
    }
}

export function Lfloor(parent, floor) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        let vertical = fs * 1.2;
        let horizontal = fs * 0.2;
        floor.height(vertical);
        floor.width(horizontal);
        floor.strokeWidth(fs2width(fs));
        floor.x(last.midX);
        floor.y(last.midY);
        last.midX = last.supX = last.subX = floor.mx();
    }
}

export function Rfloor(parent, floor) {
    return function() {
        let last = parent.get("last");
        let fs = last.fontSize;
        let vertical = fs * 1.2;
        let horizontal = fs * 0.2;
        floor.height(vertical);
        floor.width(horizontal);
        floor.strokeWidth(fs2width(fs));
        floor.x(last.midX);
        floor.y(last.midY);
        last.midX = last.supX = last.subX = floor.mx();
    }
}

export function Equiv(parent, l1, l2, l3) {
    return function rule() {
        let last = parent.get("last");
        let fs = last.fontSize;
        let x = last.midX;
        let vertical = fs * 0.4;
        let horizontal = fs * 0.5;
        let cy = last.midY;
        l1.width(horizontal);
        l1.strokeWidth(fs2width(fs));
        l1.x(x).y(cy - vertical * 0.5);
        l2.width(horizontal);
        l2.strokeWidth(fs2width(fs));
        l2.x(x).y(cy);
        l3.width(horizontal);
        l3.strokeWidth(fs2width(fs));
        l3.x(x).y(cy + vertical * 0.5);
        last.midX = last.supX = last.subX = l1.mx();
    }

}
