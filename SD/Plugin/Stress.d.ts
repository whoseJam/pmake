class StressPlugin {
    stress(scale?: number): this;
}

/**
 * Creates a **`sd.StressPlugin`** instance.
 * @param target
 * @returns A new plugin instance.
 */
export function Stress<T>(target: T): StressPlugin & T;
