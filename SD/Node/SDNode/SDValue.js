import { dqual } from "@/Math/Math";
import { equal } from "@/Math/Math";

export class SDValue {
    constructor(value) {
        this.value = value;
        this.oldValue = value;
        this.isDirty = false;
    }

    get() {
        return this.value;
    }

    getAndFlush() {
        this.flush();
        return this.value;
    }

    set(value) {
        this.value = value;
        this.isDirty = !(this.oldValue === this.value);
    }

    setByEqual(value) {
        this.value = value;
        this.isDirty = !equal(value, this.oldValue);
    }

    setByDqual(value) {
        this.value = value;
        this.isDirty = !dqual(value, this.oldValue);
    }

    dirty() {
        this.isDirty = true;
    }

    flush() {
        this.isDirty = false;
        this.oldValue = this.value;
    }

    hasChanged() {
        return this.isDirty; 
    }
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

const proxiesMap = new WeakMap();
const effectsMap = new WeakMap();
const objectsMap = new WeakMap();
let globalAllowDAGUpdate = true;
let globalFreeze = 0;
let globalEffectQueue = [];
let globalActiveEffect = undefined;

function flushDirty(effect) {
    const effectManager = effectsMap.get(effect);
    effectManager.out.forEach(link => {
        const objectManager = objectsMap.get(link.object);
        objectManager.dirty(link.key, false);
    })
}

function triggerGlobalEffectQueue() {
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
        get: function(object, key, receiver) {
            traceInput(object, key);
            const value = Reflect.get(object, key, receiver);
            if (typeof(value) === "object") {
                return reactive(value);
            }
            return value;
        },
        set: function(object, key, value, receiver) {
            if (proxiesMap.get(object)) object = proxiesMap.get(object);
            if (proxiesMap.get(value)) value = proxiesMap.get(value);
            if (key === "markerEnd") {
                console.log(object, key, value, "ass=", associated[key]);
            }
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
    object.associate = function(key, callback) {
        if (arguments.length === 0) return associated;
        associated[key] = callback;
    }
    object.merge = function(reactive) {
        reactive.mergeTo(proxy);
    }
    object.mergeTo = function(reactive) {
        for (let key in associated) {
            reactive.associate(key, associated[key]);
        }
        for (let key in object) {
            if (key in reactive) continue;
            reactive[key] = object[key];
        }
    }
    object.freeze = function() {
        freeze++;
    }
    object.unfreeze = function() {
        freeze--;
        if (freeze === 0) triggerGlobalEffectQueue();
    }
    return proxy;
}

export function effect(effect) {
    const effectFn = () => {
        globalActiveEffect = effectFn;
        effectsMap.get(effectFn).clear();
        effect();
        globalActiveEffect = undefined;
    };
    effectsMap.set(effectFn, new EffectManager(effectFn));
    effectFn();
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
    if (!globalAllowDAGUpdate) return;
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
        effectQueue.forEach(effect => {
            effect();
            flushDirty(effect);
            effect.inLocalQueue = false;
        });
    } else {
        effectQueue.forEach(effect => {
            effect.inGlobalQueue = true;
            effect.inLocalQueue = false;
        });
        globalEffectQueue = [...effectQueue, ...globalEffectQueue];
    }
    globalAllowDAGUpdate = true;
}