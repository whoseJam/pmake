import { FIRST_INTER_STAGE, LAST_INTER_STAGE, LAST_MAIN_STAGE, pause, Window } from "@/Animate/Window";

let initFinished: boolean = true;

/**
 * Initializes the framework environment.
 *
 * This method must be called before invoking `sd.main()`. It prepares the framework runtime
 * and provides an optional callback for custom initialization logic.
 *
 * @param callback - Optional callback to execute custom initialization tasks.
 *                   This can be used to set up application-specific configurations
 *                   or perform asynchronous operations before the main application starts.
 *                   If no custom logic is needed, this parameter can be omitted.
 */
export async function init(callback: (args?: Record<string, any>) => void | Promise<void>): Promise<void> {
    initFinished = false;
    const fn = async (): Promise<void> => {
        if (window.self === window.top || (window.self !== window.top && Window.IFRAME_INITED)) {
            await callback(Window.IFRAME_ARGS ?? {});
            initFinished = true;
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

/**
 * Starts the main animation process of the framework.
 *
 * This method must be called after `sd.init()` to begin the main animation process.
 * It processes all animation stages and handles segmentation via `sd.pause()` calls.
 *
 * @param callback - The main animation logic to execute.
 *                   Place all code that depends on the animation lifecycle here.
 *                   Use `sd.pause()` within this callback to segment the animation into stages.
 */
export async function main(callback: () => void | Promise<void>): Promise<void> {
    const fn = async (): Promise<void> => {
        if (initFinished) {
            await callback();
            await pause(LAST_MAIN_STAGE);
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

/**
 * Inserts an extra animation process into the main animation process.
 *
 * Use this method to create dynamic animations triggered by user interactions
 * (e.g., button clicks, input changes). The provided callback will be
 * executed immediately.
 *
 * @param callback - The extra animation logic to execute.
 */
export async function inter(callback: () => void | Promise<void>): Promise<void> {
    await pause(FIRST_INTER_STAGE);
    await callback();
    await pause(LAST_INTER_STAGE);
}
