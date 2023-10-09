
export const D3Helper = {
    element: element,
    animate: animate,
    attr: attr,
}

function element(selection) {
    return selection._groups[0][0];
}

function animate(elem, name, value, start, end) {
    let curTrans = elem.currentTransition;
    if (!curTrans ||
        curTrans.frame !== window.__frame__ ||
        curTrans.startStamp !== start ||
        curTrans.endStamp !== end) {
        curTrans = elem.transition();
        curTrans.duration(end - start);
        curTrans.delay(start);
        let startQueue = [];
        let endQueue = [];
        curTrans.on("start", function() {
            startQueue.forEach(function(callback) {
                callback();
            });
        });
        curTrans.on("end", function() {
            endQueue.forEach((callback) => {
                callback();
            });
        });
        curTrans.onStart = function(callback) {
            startQueue.push(callback);
            return curTrans;
        };
        curTrans.onEnd = function(callback) {
            endQueue.push(callback);
            return curTrans;
        };
        elem.currentTransition = curTrans;
    }
    curTrans.onStart(function() {
        processByAnimate(elem, name, curTrans.id);
    });
    setAttr(curTrans, name, value);
}

function attr(elem, name, value, start) {
    if (start === 0) {
        setAttr(elem, name, value);
        return;
    }
    let curTrans = elem.currentTransition;
    if (!curTrans ||
        curTrans.frame !== window.__frame__ ||
        curTrans.endStamp !== start) {
        curTrans = elem.transition();
        curTrans.duration(start);
        let startQueue = [];
        let endQueue = [];
        curTrans.on("start", function() {
            startQueue.forEach(function(callback) {
                callback();
            });
        });
        curTrans.on("end", function() {
            endQueue.forEach((callback) => {
                callback();
            });
        });
        curTrans.onStart = function(callback) {
            startQueue.push(callback);
            return curTrans;
        };
        curTrans.onEnd = function(callback) {
            endQueue.push(callback);
            return curTrans;
        };
        elem.currentTransition = curTrans;
    }
    curTrans.onEnd(function() {
        processByAttr(elem, name, curTrans.id);
    });
    setAttr(curTrans, name, value);
}

function setAttr(elem, name, value) {
    if (name === "text") elem.text(value);
    else elem.attr(name, value);
}

function processByAnimate(elem, name, id) {
    if (name === undefined) return;
    let schedules = getSchedules(elem);
    let me = schedules[id];
    if (!me) return;
    for (let i in schedules) {
        if (i >= id) continue;
        let o = schedules[i];
        o.removeTween(name);
    }
}

function processByAttr(elem, name) {
    if (typeof(name) === "undefined") return;
    let schedules = getSchedules(elem);
    for (let i in schedules) {
        let o = schedules[i];
        o.removeTween(name);
    }
}

function getSchedules(elem) {
    let node = elem._groups[0][0];
    if (node.__transition === undefined) return {};
    let schedules = node.__transition;
    return schedules;
}