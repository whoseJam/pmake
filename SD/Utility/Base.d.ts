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
 *
 * @example
 * const svg = sd.svg();
 * const rect = new sd.Rect(svg);
 * sd.init(() => {
 *     rect.x(100).y(100);
 * });
 */
export function init(callback: () => void): void;

/**
 * Starts the main animation process of the framework.
 *
 * This method must be called after `sd.init()` to begin the main animation process.
 * It processes all animation stages and handles segmentation via `sd.pause()` calls.
 *
 * @param callback - The main animation logic to execute.
 *                   Place all code that depends on the animation lifecycle here.
 *                   Use `sd.pause()` within this callback to segment the animation into stages.
 *
 * @example
 * sd.main(async () => {
 *     await sd.pause();
 *     rect.startAnimate().x(100).endAnimate();
 *     await sd.pause();
 *     rect.startAnimate().y(100).endAnimate();
 * });
 */
export function main(callback: () => void): void;

/**
 * Inserts an extra animation process into the main animation process.
 *
 * Use this method to create dynamic animations triggered by user interactions
 * (e.g., button clicks, input changes). The provided callback will be
 * executed immediately.
 *
 * @param callback - The extra animation logic to execute.
 *
 * @example
 * button.onClick(() => {
 *     sd.inter(async () => {
 *         await rect.startAnimate().x(100).y(100).endAnimate();
 *     });
 * });
 */
export function inter(callback: () => void): void;
