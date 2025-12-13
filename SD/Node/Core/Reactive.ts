import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

function hasChanged(v1: any, v2: any, precise?: (v1: number, v2: number) => boolean) {
    if (typeof v1 === "number" && typeof v2 === "number") {
        if (typeof precise === "function") return precise(v1, v2);
        return Math.abs(v1 - v2) > 1e-2;
    }
    return v1 !== v2;
}

class Variable {
    key: string;
    value: any;
    object: any;
}

class Queue {
    label: string;
    queue: Array<Effect>;
    constructor(name: string) {
        this.label = `in${name}Queue`;
        this.queue = [];
    }
    length() {
        return this.queue.length;
    }
    pushFront(effect: Effect) {
        effect[this.label] = true;
        this.queue.unshift(effect);
    }
    pushBack(effect: Effect) {
        effect[this.label] = true;
        this.queue.push(effect);
    }
    has(callback) {
        return callback[this.label];
    }
    execute() {
        while (this.queue.length > 0) {
            const effect = this.queue.shift();
            if (effect.anyInputHasChanged()) effect.__trigger();
            effect[this.label] = false;
        }
    }
    transfer(filter: (effect: Effect) => boolean, queue: Queue) {
        const effects = [];
        for (const effect of this.queue) {
            if (filter(effect)) {
                queue.pushBack(effect);
                effect[this.label] = false;
            } else effects.push(effect);
        }
        this.queue = effects;
    }
}

const proxiesMap: WeakMap<ProxyHandler<any>, any> = new WeakMap(); // proxy -> object
const objectsMap: WeakMap<any, ObjectManager> = new WeakMap(); // object -> ObjectManager
const effectQueue = new Queue("Effect");
const freezeQueue = new Queue("Freeze");
const afterEffects: Array<Array<() => void>> = [];
const globalUpdateKeys = [];
const globalUpdateObjects = [];
let globalAllowUpdate = true;
let globalActiveEffect = undefined;
let globalFreeze = 0;

function valueHasChanged(object: any, key: string, vn: any, vo: any) {
    const precise_ = objectsMap.get(object).precise.get(key);
    if (typeof vn === "number" && typeof vo === "number") {
        if (typeof precise_ === "function") return precise_(vn, vo);
        return Math.abs(vn - vo) > 1e-2;
    }
    return vn !== vo;
}

class Effect {
    callback: () => void;
    count: number;
    in: Array<Variable>;
    out: Array<Variable>;
    inited: boolean;
    constructor(callback: () => void) {
        this.callback = callback;
        this.count = 0;
        this.in = [];
        this.out = [];
        this.inited = false;
        if (globalActiveEffect) {
            effectQueue.pushBack(this);
        } else {
            afterEffects.push([]);
            globalAllowUpdate = false;
            effectQueue.pushBack(this);
            effectQueue.execute();
            globalAllowUpdate = true;
            const callbacks = afterEffects.shift();
            callbacks.forEach(callback => callback());
        }
    }
    trigger() {
        globalAllowUpdate = false;
        if (globalActiveEffect) throw new Error("Unexpected: globalActiveEffect is already set");
        globalActiveEffect = this;

        const out = this.out;
        this.clear();
        this.call();
        this.outputUpdate(out);
        globalActiveEffect = undefined;
        globalAllowUpdate = true;
    }
    __trigger() {
        if (globalActiveEffect) throw new Error("Unexpected: globalActiveEffect is already set");
        globalActiveEffect = this;

        const out = this.out;
        this.clear();
        this.call();
        this.outputUpdate(out);
        globalActiveEffect = undefined;
    }
    freeze() {
        this.count++;
    }
    freezing() {
        return this.count + globalFreeze;
    }
    unfreeze() {
        this.count--;
        if (this.count === 0) transferMeltingEffect();
    }
    call() {
        this.callback();
    }
    clear() {
        this.in.forEach(variable => {
            const objectManager = objectsMap.get(variable.object);
            objectManager.outputEffects(variable.key)?.delete(this);
        });
        this.out.forEach(variable => {
            const objectManager = objectsMap.get(variable.object);
            objectManager.inputEffects(variable.key)?.delete(this);
        });
        [this.in, this.out] = [[], []];
    }
    pushInput(object: any, key: string, value: any) {
        for (let i = 0; i < this.in.length; i++) {
            if (this.in[i].key === key && this.in[i].object === object) {
                this.in[i].value = value;
                return;
            }
        }
        this.in.push({ object, key, value });
    }
    pushOutput(object: any, key: string, value: any) {
        for (let i = 0; i < this.out.length; i++) {
            if (this.out[i].key === key && this.out[i].object === object) {
                this.out[i].value = value;
                return;
            }
        }
        this.out.push({ object, key, value });
    }
    inputHasChanged(object: any, key: string) {
        const objectManager = objectsMap.get(object);
        const old = this.in.find(variable => variable.key === key && variable.object === object);
        if (!old) throw new Error("Unexpected: input variable not found");
        return hasChanged(old.value, object[key], objectManager.precise.get(key));
    }
    anyInputHasChanged() {
        if (!this.inited) {
            this.inited = true;
            return true;
        }
        for (let i = 0; i < this.in.length; i++) {
            const old = this.in[i];
            const objectManager = objectsMap.get(old.object);
            if (hasChanged(old.value, old.object[old.key], objectManager.precise.get(old.key))) return true;
        }
        return false;
    }
    whichInputHasChanged() {
        for (let i = 0; i < this.in.length; i++) {
            const old = this.in[i];
            const objectManager = objectsMap.get(old.object);
            if (hasChanged(old.value, old.object[old.key], objectManager.precise.get(old.key)))
                return [old.key, old.value, old.object[old.key]];
        }
    }
    inputValue(key: string) {
        const input = this.in.filter(variable => {
            return variable.key === key;
        })[0];
        return input.value;
    }
    outputUpdate(out: Array<Variable>) {
        this.out.forEach(variable => {
            if (variable.object.freezing() > 0) return;
            const { key, object, value } = variable;
            const objectManager = objectsMap.get(variable.object);
            const lastVariable = out.find(variable_ => variable_.key === key && variable_.object === object);
            const outEffectsSet = objectManager.outputEffects(key);
            outEffectsSet?.forEach(effect => {
                if (lastVariable && !valueHasChanged(object, key, value, effect.inputValue(key))) return;
                if (effectQueue.has(effect)) return;
                effectQueue.pushBack(effect);
            });
        });
    }
}

class ObjectManager {
    proxy: ProxyHandler<any>;
    object: any;
    inEffects: Map<string, Set<Effect>>;
    outEffects: Map<string, Set<Effect>>;
    precise: Map<string, (v1: number, v2: number) => boolean>;
    constructor(object: any, proxy: ProxyHandler<any>) {
        this.proxy = proxy;
        this.object = object;
        this.inEffects = new Map();
        this.outEffects = new Map();
        this.precise = new Map();
    }
    inputEffects(key: string): Set<Effect> | undefined {
        const inEffectsSet = this.inEffects.get(key);
        return inEffectsSet ? inEffectsSet : undefined;
    }
    outputEffects(key: string): Set<Effect> | undefined {
        const outEffectsSet = this.outEffects.get(key);
        return outEffectsSet ? outEffectsSet : undefined;
    }
    pushInput(key: string, effect: Effect) {
        let inEffectsSet = this.inEffects.get(key);
        if (!inEffectsSet) {
            inEffectsSet = new Set();
            this.inEffects.set(key, inEffectsSet);
        }
        inEffectsSet.add(effect);
    }
    pushOutput(key: string, effect: Effect) {
        let outEffectsSet = this.outEffects.get(key);
        if (!outEffectsSet) {
            outEffectsSet = new Set();
            this.outEffects.set(key, outEffectsSet);
        }
        outEffectsSet.add(effect);
    }
}

function transferMeltingEffect() {
    freezeQueue.transfer(effect => {
        return effect.freezing() === 0 && !effectQueue.has(effect);
    }, effectQueue);
    if (!globalAllowUpdate) return;
    afterEffects.push([]);
    globalAllowUpdate = false;
    effectQueue.execute();
    globalAllowUpdate = true;
    const callbacks = afterEffects.shift();
    callbacks.forEach(callback => callback());
}

export function afterEffect(callback: () => void) {
    if (afterEffects.length > 0) afterEffects[afterEffects.length - 1].push(callback);
    else callback();
}

export function freeze() {
    globalFreeze++;
}

export function unfreeze() {
    globalFreeze--;
    if (globalFreeze === 0) transferMeltingEffect();
}

export function setPrecise(proxy: ProxyHandler<any>, key: string, type: (vn: number, vo: number) => boolean) {
    const object = proxiesMap.get(proxy);
    const objectManager = objectsMap.get(object);
    objectManager.precise.set(key, type);
}

export function reactive(object: { [key: string]: any }, fatherObject?: any) {
    if (objectsMap.has(object)) return objectsMap.get(object).proxy;
    let freezing = fatherObject ? fatherObject.freezing() : 0;
    const freezingWatches: Array<() => void> = [];
    const freezingKeys: Array<string> = [];
    const watchingList: { [key: string]: Array<(vn: any, vo: any) => void> } = {};
    const proxy = new Proxy(object, {
        get(object, key: string, receiver) {
            const value = Reflect.get(object, key, receiver);
            traceInput(object, key, value);
            if (value instanceof SDNode || value instanceof RenderNode) return value;
            if (typeof value === "object") return reactive(value, object);
            return value;
        },
        set(object, key: string, value: any, receiver) {
            if (proxiesMap.get(object)) object = proxiesMap.get(object);
            if (proxiesMap.get(value)) value = proxiesMap.get(value);
            traceOutput(object, key, value);
            const vn = value;
            const vo = Reflect.get(object, key, receiver);
            if (watchingList[key] && valueHasChanged(object, key, vo, vn)) {
                const triggerWatching = () => watchingList[key].forEach(callback => callback(vn, vo));
                if (object.freezing() > 0) freezingWatches.push(triggerWatching);
                else triggerWatching();
            }
            Reflect.set(object, key, value, receiver);
            if (object.freezing() > 0) freezingKeys.push(key);
            else triggerUpdate(object, key);
            return true;
        },
    });
    proxiesMap.set(proxy, object);
    objectsMap.set(object, new ObjectManager(object, proxy));
    Object.assign(object, {
        trigger(key: string) {
            const value = object[key];
            if (watchingList[key]) {
                const triggerWatching = () => watchingList[key].forEach(callback => callback(value, value));
                if (object.freezing() > 0) freezingWatches.push(triggerWatching);
                else triggerWatching();
            }
        },
        watch(key: string, callback: (vn: any, vo: any) => void) {
            if (arguments.length === 0) return watchingList;
            const keys = key.split(".");
            if (keys.length === 1) {
                if (!watchingList[keys[0]]) watchingList[keys[0]] = [];
                watchingList[keys[0]].push(callback);
            } else {
                const keys_ = keys.slice(1).join(".");
                proxy[keys[0]].watch(keys_, callback);
            }
        },
        merge(object_: any) {
            for (const key in object_) object[key] = object_[key];
        },
        setTogether(pairs: { [key: string]: any }) {
            const objects = [];
            const keys = [];
            const callbacks = [];
            for (const key in pairs) {
                let value = pairs[key];
                if (proxiesMap.get(object)) object = proxiesMap.get(object);
                if (proxiesMap.get(value)) value = proxiesMap.get(value);
                traceOutput(object, key, value);
                const vn = value;
                const vo = object[key];
                object[key] = value;
                if (watchingList[key] && valueHasChanged(object, key, vn, vo)) {
                    watchingList[key].forEach(callback => callbacks.push(() => callback(vn, vo)));
                }
                objects.push(object);
                keys.push(key);
            }
            const triggerWatching = () => callbacks.forEach(callback => callback());
            if (object.freezing() > 0) {
                freezingWatches.push(triggerWatching);
                for (const key of keys) freezingKeys.push(key);
            } else {
                triggerWatching();
                triggerUpdates(objects, keys);
            }
        },
        lpset(key: string, value: number) {
            setPrecise(proxy, key, lowPrecise);
            proxy[key] = value;
        },
        mpset(key: string, value: number) {
            setPrecise(proxy, key, mediumPrecise);
            proxy[key] = value;
        },
        hpset(key: string, value: number) {
            setPrecise(proxy, key, highPrecise);
            proxy[key] = value;
        },
        freeze() {
            freezing++;
            for (const key in object) {
                const value = object[key];
                if (value && typeof value.freeze === "function") value.freeze();
            }
        },
        freezing() {
            return freezing;
        },
        unfreeze() {
            freezing--;
            for (const key in object) {
                const value = object[key];
                if (value && typeof value.unfreeze === "function") value.unfreeze();
            }
            if (freezing === 0) {
                freezingWatches.forEach(callback => callback());
                freezingWatches.splice(0);
                if (freezingKeys.length > 0) {
                    for (const key of freezingKeys) {
                        globalUpdateObjects.push(object);
                        globalUpdateKeys.push(key);
                    }
                    freezingKeys.splice(0);
                }
            }
            if (!fatherObject && globalUpdateObjects.length > 0) {
                triggerUpdates(globalUpdateObjects, globalUpdateKeys);
                globalUpdateObjects.splice(0);
                globalUpdateKeys.splice(0);
            }
        },
    });
    return proxy;
}

function lowPrecise(v1: number, v2: number) {
    return Math.abs(v1 - v2) >= 1;
}

function mediumPrecise(v1: number, v2: number) {
    return Math.abs(v1 - v2) >= 1e-1;
}

function highPrecise(v1: number, v2: number) {
    return Math.abs(v1 - v2) >= 1e-2;
}

export function effect(callback: () => void) {
    return new Effect(callback);
}

export function object(proxy: ProxyHandler<any>) {
    if (proxiesMap.get(proxy)) return proxiesMap.get(proxy);
    return proxy;
}

export function uneffect(effect: Effect) {
    effect.clear();
}

function traceInput(object: any, key: string, value: any) {
    if (!globalActiveEffect) return;
    const effect = globalActiveEffect as Effect;
    effect.pushInput(object, key, value);
    const objectManager = objectsMap.get(object);
    objectManager.pushOutput(key, effect);
}

function traceOutput(object: any, key: string, value: any) {
    if (!globalActiveEffect) return;
    const effect = globalActiveEffect as Effect;
    effect.pushOutput(object, key, value);
    const objectManager = objectsMap.get(object);
    objectManager.pushInput(key, effect);
}

function collectEffect(queue: Queue, object: any, key: string) {
    const objectManager = objectsMap.get(object);
    const outEffectsSet = objectManager.outputEffects(key);
    outEffectsSet?.forEach(effect => {
        if (!effect.inputHasChanged(object, key)) return;
        if (queue.has(effect)) return;
        if (effect.freezing() > 0) freezeQueue.pushBack(effect);
        else queue.pushBack(effect);
    });
}

function collectEffectOnDAG(queue: Queue, objects: Array<any>, keys: Array<string>) {
    if (objects.length !== keys.length) throw new Error("Unexpected: objects and keys length mismatch");

    const visitedObject: Map<any, Map<string, Set<Effect>>> = new Map(); // Object -> Key -> Set<Effect>
    const visitedEffect: Map<Effect, { degree: number; object: any }> = new Map();
    function dfs(object: any, key: string, lastEffect: Effect = undefined) {
        if (!visitedObject.has(object)) visitedObject.set(object, new Map());
        if (!visitedObject.get(object).has(key)) visitedObject.get(object).set(key, new Set());
        if (lastEffect && visitedObject.get(object).get(key).has(lastEffect)) return;
        if (lastEffect) visitedObject.get(object).get(key).add(lastEffect);
        const objectManager = objectsMap.get(object);
        const outEffectsSet = objectManager.outputEffects(key);
        outEffectsSet?.forEach(effect => {
            if (!visitedEffect.has(effect)) {
                visitedEffect.set(effect, {
                    degree: 0,
                    object,
                });
            }
            if (lastEffect && lastEffect !== effect) visitedEffect.get(effect).degree++;
            effect.out.forEach(variable => {
                dfs(variable.object, variable.key, effect);
            });
        });
    }
    for (let i = 0; i < objects.length; i++) dfs(objects[i], keys[i]);
    const tmpQueue: Array<Effect> = [];
    visitedEffect.forEach((node, effect) => {
        if (node.degree === 0) tmpQueue.push(effect);
    });
    if (tmpQueue.length === 0) {
        for (let i = 0; i < objects.length; i++) collectEffect(queue, objects[i], keys[i]);
    }
    while (tmpQueue.length > 0) {
        const effect = tmpQueue.shift();
        if (effect.freezing() > 0) {
            freezeQueue.pushBack(effect);
        } else {
            queue.pushBack(effect);
            effect.out.forEach(variable => {
                if (variable.object.freezing() > 0) return;
                const objectManager = objectsMap.get(variable.object);
                const outEffectsSet = objectManager.outputEffects(variable.key);
                outEffectsSet?.forEach(nextEffect => {
                    if (!--visitedEffect.get(nextEffect).degree) {
                        tmpQueue.push(nextEffect);
                    }
                });
            });
        }
    }
}

function triggerUpdate(object: any, key: string) {
    triggerUpdates([object], [key]);
}

function triggerUpdates(objects: Array<any>, keys: Array<string>) {
    if (!globalAllowUpdate) return;
    afterEffects.push([]);
    globalAllowUpdate = false;
    collectEffectOnDAG(effectQueue, objects, keys);
    effectQueue.execute();
    globalAllowUpdate = true;
    const callbacks = afterEffects.shift();
    callbacks.forEach(callback => callback());
}

export function checkEffect(effect: Effect) {
    console.log("effect=", effect.callback);
    console.log(effect.in);
    console.log(effect.out);
    console.log("");
}
