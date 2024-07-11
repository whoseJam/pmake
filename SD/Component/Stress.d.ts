interface StressType {
    stress(): this;
}

export function Stress<T>(parent: T): StressType&T;