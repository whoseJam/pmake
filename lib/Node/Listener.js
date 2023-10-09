let listenId = 0;

export function Listener(self) {
    self.stopListen = stopListen;
    self.listen = listen;
    self.call = call;

    return self;
}

function encode(name) {
    return "listener_" + name;
}

function call(name) {
    name = encode(name);
    if (this[name] !== undefined) {
        this[name].forEach((obj) => {
            let fn = obj.callback.bind(obj.from);
            fn();
        });
    }
}

function listen(name, func, from) {
    name = encode(name);
    if (this[name] === undefined)
        this[name] = [];
    if (typeof(from) !== "undefined") {
        this[name].push({ callback: func, from: from, id: listenId });
    } else {
        this[name].push({
            callback: func,
            from: this,
            id: listenId
        });
    }
    listenId++;
}

function stopListen(name, id) {
    let queue = this[name];
    this[name] = queue.filter((obj) => {
        return obj.id !== id;
    });
}