import { pause }             from "@/Animate/Window";
import { LAST_MAIN_FRAME }   from "@/Animate/Window";
import { LAST_INTER_FRAME }  from "@/Animate/Window";
import { FIRST_INTER_FRAME } from "@/Animate/Window";

export function int(x) {
    return ~~x;
}

export function init(callback) {
    callback();
}

export async function main(callback) {
    await callback();
    await pause(LAST_MAIN_FRAME);
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