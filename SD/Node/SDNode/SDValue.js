const proxiesMap = new WeakMap();
const effectsMap = new WeakMap();
const objectsMap = new WeakMap();
let globalAllowDAGUpdate = true;
let globalFreeze = 0;
let globalEffectQueue = [];
let globalActiveEffect = undefined;

class EffectManager {
    constructor(effect) {
        this.effect = effect;
        this.in = [];
        this.out = [];
    }

    clear() {
        this.in.forEach(link => {
            const objectManager = objectsMap.get(link.object);
            objectManager.outputEffects(link.key).delete(this.effect);
        });
        this.out.forEach(link => {
            const objectManager = objectsMap.get(link.object);
            objectManager.inputEffects(link.key).delete(this.effect);
        });
        this.in = [];
        this.out = [];
    }

    pushInput(object, key) {
        for (let i = 0; i < this.in.length; i++) {
            if (this.in[i].key === key && this.in[i].object === object) return;
        }
        this.in.push({ object, key });
    }

    pushOutput(object, key) {
        for (let i = 0; i < this.out.length; i++) {
            if (this.out[i].key === key && this.out[i].object === object) return;
        }
        this.out.push({ object, key });
    }

    handleNewOutput(oldOut) {
        // console.log(oldOut, this.out);
        // this.out.forEach(link => {
        //     for (let i = 0; i < oldOut.length; i++) {
        //         if (oldOut[i].key === link.key && oldOut[i].object === link.object) return;
        //     }
        //     console.log("attach update=", link.object, link.key);
        //     setTimeout(() => {
        //         triggerDAGUpdate(link.object, link.key);
        //     }, 0);
        // })
    }
}

class ObjectManager {
    constructor(proxy) {
        this.proxy = proxy;
        this.isDirty = new Map();
        this.inEffects = new Map();
        this.outEffects = new Map();
    }

    dirty(key, dirty) {
        if (dirty === undefined) return this.isDirty.get(key) ? true : false;
        this.isDirty.set(key, dirty);
    }

    inputEffects(key) {
        const inEffectsSet = this.inEffects.get(key);
        return inEffectsSet ? inEffectsSet : [];
    }

    outputEffects(key) {
        const outEffectsSet = this.outEffects.get(key);
        return outEffectsSet ? outEffectsSet : [];
    }

    pushInput(key, effect) {
        let inEffectsSet = this.inEffects.get(key);
        if (!inEffectsSet) {
            inEffectsSet = new Set();
            this.inEffects.set(key, inEffectsSet);
        }
        inEffectsSet.add(effect);
    }

    pushOutput(key, effect) {
        let outEffectsSet = this.outEffects.get(key);
        if (!outEffectsSet) {
            outEffectsSet = new Set();
            this.outEffects.set(key, outEffectsSet);
        }
        outEffectsSet.add(effect);
    }
}

function flushDirty(effect) {
    const effectManager = effectsMap.get(effect);
    effectManager.out.forEach(link => {
        const objectManager = objectsMap.get(link.object);
        objectManager.dirty(link.key, false);
    })
}

function triggerGlobalEffectQueue() {
    console.log("trigger global effect queue = ", globalEffectQueue)
    globalAllowDAGUpdate = false;
    globalEffectQueue.forEach(effect => {
        effect();
        flushDirty(effect);
        effect.inGlobalQueue = false;
    });
    globalEffectQueue = [];
    globalAllowDAGUpdate = true;
}

export function freeze() {
    globalFreeze++;
}

export function unfreeze() {
    globalFreeze--;
    if (globalFreeze === 0) triggerGlobalEffectQueue();
}

export function reactive(object) {
    if (objectsMap.has(object)) {
        return objectsMap.get(object).proxy;
    }
    let freeze = 0;
    let associated = {};
    const proxy = new Proxy(object, {
        get: function (object, key, receiver) {
            // if (!!target[key] && !!target[key].bind) {
            //     // 使用 bind 绑定 this 指向
            //     return target[key].bind(target);
            // } else {
            //     return target[key];
            // }
            traceInput(object, key);

            // let value;
            // if (!!object[key] && !!object[key].bind) {
            //     value = Reflect.get(object, key, receiver).bind(object);
            // } else {
            //     value = Reflect.get(object, key, receiver);
            // }
            const value = Reflect.get(object, key, receiver);
            if (typeof (value) === "object") {
                return reactive(value);
            }
            return value;
        },
        set: function (object, key, value, receiver) {
            if (proxiesMap.get(object)) object = proxiesMap.get(object);
            if (proxiesMap.get(value)) value = proxiesMap.get(value);
            traceOutput(object, key);
            if (associated[key]) {
                associated[key](value, Reflect.get(object, key, receiver));
            }
            Reflect.set(object, key, value, receiver);
            triggerDAGUpdate(object, key, freeze + globalFreeze);
            return true;
        }
    });
    proxiesMap.set(proxy, object);
    objectsMap.set(object, new ObjectManager(proxy));
    object.associate = function (key, callback) {
        if (arguments.length === 0) return associated;
        associated[key] = callback;
    }
    object.merge = function (otherObject) {
        for (let key in otherObject) {
            object[key] = otherObject[key];
        }
    }
    object.freeze = function () {
        freeze++;
    }
    object.unfreeze = function () {
        freeze--;
        if (freeze === 0) triggerGlobalEffectQueue();
    }
    return proxy;
}

export function effect(effect, info) {
    const effectFn = () => {
        console.log("trigger effect=", effect, info);
        if (globalActiveEffect !== undefined) {
            // throw new Error("Nested Effect");
        }
        globalActiveEffect = effectFn;
        const effectManager = effectsMap.get(effectFn);
        const out = effectManager.out;
        effectManager.clear();
        effect();
        effectManager.handleNewOutput(out);
        globalActiveEffect = undefined;
        console.log("finish effect");
        console.log("");
    };
    effectFn.innerEffect = effect;
    effectsMap.set(effectFn, new EffectManager(effectFn));
    // globalAllowDAGUpdate = false;
    effectFn();
    // globalAllowDAGUpdate = true;
    return effectFn;
}

export function uneffect(effect) {
    const effectManager = effectsMap.get(effect);
    delete effectsMap[effect];
    effectManager.clear();
}

export function isDirty(proxy, key) {
    const object = proxiesMap.get(proxy);
    const objectManager = objectsMap.get(object);
    return objectManager.dirty(key);
}

function traceInput(object, key) {
    if (!globalActiveEffect) return;
    const effectManager = effectsMap.get(globalActiveEffect);
    effectManager.pushInput(object, key);
    const objectManager = objectsMap.get(object);
    objectManager.pushOutput(key, globalActiveEffect);
}

function traceOutput(object, key) {
    if (!globalActiveEffect) return;
    const effectManager = effectsMap.get(globalActiveEffect);
    effectManager.pushOutput(object, key);
    const objectManager = objectsMap.get(object);
    objectManager.pushInput(key, globalActiveEffect);
}

function triggerDAGUpdate(object, key, freeze) {
    // if (!globalAllowDAGUpdate) return;
    globalAllowDAGUpdate = false;
    const effectQueue = [];
    function collectTriggeredEffect(object, key) {
        const objectManager = objectsMap.get(object);
        objectManager.dirty(key, true);
        const outEffectsSet = objectManager.outputEffects(key);
        outEffectsSet.forEach(effect => {
            if (freeze === 0) {
                if (effect.inLocalQueue) return;
                effect.inLocalQueue = true;
            } else {
                if (effect.inLocalQueue || effect.inGlobalQueue) return;
                effect.inLocalQueue = true;
            }
            effectQueue.push(effect);
            const effectManager = effectsMap.get(effect);
            effectManager.out.forEach(link => {
                collectTriggeredEffect(link.object, link.key);
            });
        });
    }
    collectTriggeredEffect(object, key);
    if (freeze === 0) {
        console.log("effect Queue=", effectQueue, effectQueue.length);
        effectQueue.forEach(effect => {
            effect();
            flushDirty(effect);
            effect.inLocalQueue = false;
        });
        console.log("end");
    } else {
        effectQueue.forEach(effect => {
            effect.inGlobalQueue = true;
            effect.inLocalQueue = false;
        });
        globalEffectQueue = [...effectQueue, ...globalEffectQueue];
    }
    globalAllowDAGUpdate = true;
}

export function checkEffect(effect) {
    console.log("effect=", effect);
    const effectManager = effectsMap.get(effect);
    console.log(effectManager.in);
    console.log(effectManager.out);
    console.log("");
}