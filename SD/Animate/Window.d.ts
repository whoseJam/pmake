export const NORMAL_STAGE = 0;
export const LAST_MAIN_STAGE = 1;
export const LAST_INTER_STAGE = 2;
export const FIRST_INTER_STAGE = 3;
export const CONTINUE_STAGE = 4;

/**
 * Pauses execution flow until the user triggers the next stage.
 * Acts as an interactive breakpoint between two animation stage.
 * @param type - Optional pause behavior (0-4). Defaults to 0 (NORMAL_STAGE).
 *               - 0: NORMAL_STAGE - A standard interactive pause.
 *               - 1: LAST_MAIN_STAGE - Last stage of the main animation (internal use only).
 *               - 2: LAST_INTER_STAGE - Last stage of an interstitial animation (internal use only).
 *               - 3: FIRST_INTER_STAGE - First stage of an interstitial animation (internal use only).
 *               - 4: CONTINUE_STAGE - Unbreakable stage. No extra animation process can be insert after this stage
 *                                     so that the next stage must also be a stage from the same animation process.
 * @returns A promise that resolves when the pause condition is met.
 * @example
 * await sd.pause(); // Wait for user to click 'N'('N' for next) button.
 * // Operations to execute in the next animation stage.
 * await sd.pause(); // Wait for another user interaction.
 * // Operations to execute in the next animation stage.
 */
export async function pause(type?: 0 | 1 | 2 | 3 | 4): Promise<void>;
