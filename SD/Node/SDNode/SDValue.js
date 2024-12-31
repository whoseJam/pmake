import { Check } from "@/Utility/Check";

let cnt = 0;

class EffectQueue {
    constructor(name) {
        this.label = `in${name}Queue`;
        this.queue = [];
    }

    pushFront(effect) {
        effect[this.label] = true;
        this.queue.unshift(effect);
    }

    pushBack(effect) {
        effect[this.label] = true;
        this.queue.push(effect);
    }

    transfer(other) {
        for (let i = this.queue.length - 1; i >= 0; i--) {
            const effect = this.queue[i];
            effect[this.label] = false;
            effect[other.label] = true;
            other.pushFront(effect);
        }
        this.queue = [];
    }

    execute() {
        currentEffectQueue = this;
        while (this.queue.length > 0) {
            const effect = this.queue[0];
            this.queue.shift();
            effect();
            flushDirty(effect);
            effect[this.label] = false;
        }
        currentEffectQueue = undefined;
    }
}

const proxiesMap = new WeakMap();
const effectsMap = new WeakMap();
const objectsMap = new WeakMap();
let globalAllowDAGUpdate = true;
let globalFreeze = 0;
const localEffectQueue = new EffectQueue("Local");
const globalEffectQueue = new EffectQueue("Global");
let currentEffectQueue = undefined;
let globalActiveEffect = undefined;

function hasChanged(oldValue, newValue) {
    if (typeof oldValue === "number" && typeof newValue === "number") return Math.abs(oldValue - newValue) > 1e-2;
    return oldValue !== newValue;
}

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

    pushOutput(object, key, value) {
        for (let i = 0; i < this.out.length; i++) {
            if (this.out[i].key === key && this.out[i].object === object) {
                this.out[i].value = value;
                return;
            }
        }
        this.out.push({ object, key, value });
    }

    handleNewOutput(oldOut) {
        this.out.forEach(link => {
            let isNewOutput = true,
                oldValue = undefined;
            for (let i = 0; i < oldOut.length && isNewOutput; i++) {
                if (link.key === oldOut[i].key && link.object === oldOut[i].object) {
                    isNewOutput = false;
                    oldValue = oldOut[i].value;
                }
            }
            if (isNewOutput || hasChanged(oldValue, link.value)) {
                const objectManager = objectsMap.get(link.object);
                const outEffectsSet = objectManager.outputEffects(link.key);
                outEffectsSet.forEach(effect => {
                    if (effect[currentEffectQueue.label]) return;
                    currentEffectQueue.pushFront(effect);
                });
            }
        });
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
    });
}

function triggerGlobalEffectQueue() {
    if (!globalAllowDAGUpdate) return;
    globalAllowDAGUpdate = false;
    globalEffectQueue.execute();
    globalAllowDAGUpdate = true;
}

export function freeze() {
    globalFreeze++;
}

export function unfreeze() {
    globalFreeze--;
    if (globalFreeze === 0) triggerGlobalEffectQueue();
}

function shouldTriggerUpdate(object, key) {
    if (Array.isArray(object)) return key === "length";
    return true;
}

export function reactive(object, father = undefined) {
    if (objectsMap.has(object)) {
        return objectsMap.get(object).proxy;
    }
    let freeze = 0;
    let associated = {};
    const proxy = new Proxy(object, {
        get: function (object, key, receiver) {
            traceInput(object, key);
            const value = Reflect.get(object, key, receiver);
            if (Check.isTypeOfSDNode(value)) return value;
            if (typeof value === "object") {
                return reactive(value, object);
            }
            return value;
        },
        set: function (object, key, value, receiver) {
            if (proxiesMap.get(object)) object = proxiesMap.get(object);
            if (proxiesMap.get(value)) value = proxiesMap.get(value);
            traceOutput(object, key, value);
            if (associated[key]) {
                const newValue = value;
                const oldValue = Reflect.get(object, key, receiver);
                if (hasChanged(newValue, oldValue)) {
                    associated[key].forEach(callback => {
                        callback(newValue, oldValue);
                    });
                }
            }
            Reflect.set(object, key, value, receiver);
            if (shouldTriggerUpdate(object, key)) triggerDAGUpdate(object, key, object.freezing() + globalFreeze);
            return true;
        },
    });
    proxiesMap.set(proxy, object);
    objectsMap.set(object, new ObjectManager(proxy));
    object.associate = function (key, callback) {
        if (arguments.length === 0) return associated;
        if (!associated[key]) associated[key] = [];
        associated[key].push(callback);
    };
    object.merge = function (otherObject) {
        for (let key in otherObject) {
            object[key] = otherObject[key];
        }
    };
    object.freeze = function () {
        freeze++;
    };
    object.freezing = function () {
        if (father) return father.freezing() + freeze;
        return freeze;
    };
    object.unfreeze = function () {
        freeze--;
        if (freeze === 0) triggerGlobalEffectQueue();
    };
    return proxy;
}

export function effect(innerEffect, tag) {
    const effectFn = () => {
        if (globalActiveEffect) {
            throw new Error("Fuck");
        }
        globalActiveEffect = effectFn;
        const effectManager = effectsMap.get(effectFn);
        const out = effectManager.out;
        effectManager.clear();
        innerEffect();
        effectManager.handleNewOutput(out);
        globalActiveEffect = undefined;
    };
    effectsMap.set(effectFn, new EffectManager(effectFn));
    globalAllowDAGUpdate = false;
    localEffectQueue.pushBack(effectFn);
    effectFn.tag = tag ? tag : innerEffect;
    localEffectQueue.execute();
    globalAllowDAGUpdate = true;
    return effectFn;
}

export function object(proxy) {
    if (proxiesMap.get(proxy)) return proxiesMap.get(proxy);
    return proxy;
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

function traceOutput(object, key, value) {
    if (!globalActiveEffect) return;
    const effectManager = effectsMap.get(globalActiveEffect);
    effectManager.pushOutput(object, key, value);
    const objectManager = objectsMap.get(object);
    objectManager.pushInput(key, globalActiveEffect);
}

function triggerDAGUpdate(object, key, freeze) {
    if (!globalAllowDAGUpdate) return;
    globalAllowDAGUpdate = false;
    function collectTriggeredEffect(object, key) {
        const objectManager = objectsMap.get(object);
        objectManager.dirty(key, true);
        const outEffectsSet = objectManager.outputEffects(key);
        outEffectsSet.forEach(effect => {
            if (freeze === 0) {
                if (effect[localEffectQueue.label]) return;
                effect[localEffectQueue.label] = true;
            } else {
                if (effect[localEffectQueue.label] || effect[globalEffectQueue.label]) return;
                effect[localEffectQueue.label] = true;
            }
            localEffectQueue.pushBack(effect);
            const effectManager = effectsMap.get(effect);
            effectManager.out.forEach(link => {
                collectTriggeredEffect(link.object, link.key);
            });
        });
    }
    collectTriggeredEffect(object, key);
    if (freeze === 0) {
        localEffectQueue.execute();
    } else {
        localEffectQueue.transfer(globalEffectQueue);
    }
    globalAllowDAGUpdate = true;
}

export function checkEffect(effect) {
    console.log("effect=", effect.tag);
    const effectManager = effectsMap.get(effect);
    console.log(effectManager.in);
    console.log(effectManager.out);
    console.log("");
}
