import { pause }             from "@/Animate/Window";
import { LAST_MAIN_FRAME }   from "@/Animate/Window";
import { LAST_INTER_FRAME }  from "@/Animate/Window";
import { FIRST_INTER_FRAME } from "@/Animate/Window";

let initFinished = true;

export function int(x) {
    return ~~x;
}

export async function init(callback) {
    initFinished = false;
    await callback();
    initFinished = true;
}

export async function main(callback) {
    const fn = async () => {
        if (initFinished) {
            await callback();
            await pause(LAST_MAIN_FRAME);
        } else {
            setTimeout(fn, 20);
        }
    }
    setTimeout(fn, 20);
}

export async function inter(callback) {
    await pause(FIRST_INTER_FRAME);
    await callback();
    await pause(LAST_INTER_FRAME);
}

export function make1d(length, defaultValue = 0) {
    const result = [];
    for (let i = 0; i < length; i++) {
        if (typeof(defaultValue) === "object") {
            result.push(Object.assign({}, defaultValue));
        } else result.push(defaultValue);
    } 
    return result;
}

export function make2d(rows, columns, defaultValue = 0) {
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push(make1d(columns, defaultValue));
    }
    return result;
}