
export class Action {
    static STOP_FLAG = 1 << 0;
    static HIDE_FLAG = 1 << 1;
    static FIRST_CALL_FLAG = 1 << 2;

    constructor(l: number, r: number, source: any, target: any, callback: (t: number) => void, owner: any, channel: string, flag: boolean);

    is(flag: number): void;
    set(flag: number): void;
    unset(flag: number): void;

    tick(t: number): void;

    forceToFinish(): void;

    toString(): string;

    ownerIsReady(): boolean;

    clone(): Action;
}