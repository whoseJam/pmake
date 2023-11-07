
export const SDHelper = {
    forwardFunc: forwardFunc,
    proper1Func: proper1Func,
    proper2Func: proper2Func
}

function forwardFunc(childId, name) {
    return function() {
        let child = this.children.child(childId);
        return child[name].apply(child, arguments);
    }
}

function proper1Func(childId, name) {
    return function(value) {
        let child = this.children.child(childId);
        if (value === undefined)
            return child[name]();
        child[name](value);
        return this;
    }
}

function proper2Func(childId, name) {
    return function(v1, v2) {
        let child = this.children.child(childId);
        if (v1 === undefined)
            return child[name]();
        child[name](v1, v2);
        return this;
    }
}