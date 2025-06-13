import { FIRST_INTER_FRAME, LAST_INTER_FRAME, LAST_MAIN_FRAME, pause } from "@/Animate/Window";

let initFinished = true;

export async function init(callback) {
    initFinished = false;
    const fn = async () => {
        if (window.self === window.top || (window.self !== window.top && window.IFRAME_INITED)) {
            await callback(window.IFRAME_ARGS ? window.IFRAME_ARGS : {});
            initFinished = true;
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

export async function main(callback) {
    const fn = async () => {
        if (initFinished) {
            await callback();
            await pause(LAST_MAIN_FRAME);
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

export async function inter(callback) {
    await pause(FIRST_INTER_FRAME);
    await callback();
    await pause(LAST_INTER_FRAME);
}
