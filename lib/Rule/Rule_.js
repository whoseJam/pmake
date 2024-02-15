/**
 * 对于可以随意放缩的对象child，将child作为parent的背景板
 * @returns Background规则
 */
function Background() {
    return function(parent, child) {
        let x = parent.x();
        let y = parent.y();
        let width = parent.width();
        let height = parent.height();
        child.x(x).y(y);
        child.width(width);
        child.height(height);
    }
}

/**
 * 仅仅在位置上，将child作为parent的中心，不考虑大小关系
 * @returns CenterOnly规则
 */
function CenterOnly() {
    return function(parent, child) {
        let cx = parent.cx();
        let cy = parent.cy();
        child.cx(cx).cy(cy);
    }
}

/**
 * 对于不可随意缩放的对象child，考虑位置和大小关系，将child放置于parent的中心
 * @param {number} rate 空闲率 
 * @returns CenterFixAspect规则
 */
function CenterFixAspect(rate = 1.2) {
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

function Center(rate = 1.2) {
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

function TriangleCenterFixAspect(rate = 1.2) {
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

function OnRightSide(align = "center", margin = 5) {
    let locator = (
        align === "top" ? "y" : 
        align === "center" ? "cy" : 
        align === "bottom" ? "my" : null);
    if (!locator) throw new Error("invalid arguments align = " + align);
    return function(parent, child) {
        child[locator](parent[locator]());
        child.x(parent.mx() + margin);
    }
}

function PointAtPathByRate(k, xloc = "cx", yloc = "cy") {
    return function(parent, child) {
        let point = parent.at(k);
        child[xloc](point[0]);
        child[yloc](point[1]);
    }
}

function PointAtPathByLength(length, xloc = "x", yloc = "y") {
    return function(parent, child) {
        let point = parent.getPointAtLength(length);
        child[xloc](point[0]);
        child[yloc](point[1]);
    }
}

/**
 * 内置的所有规则
 */
export const Rule = {
    Background: Background,
    CenterOnly: CenterOnly,
    CenterFixAspect: CenterFixAspect,
    Center: Center,
    TriangleCenterFixAspect: TriangleCenterFixAspect,
    OnRightSide,
    PointAtPathByRate: PointAtPathByRate,
    PointAtPathByLength: PointAtPathByLength
}