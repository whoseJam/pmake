interface PoolParams<T = any> {
    onIdle: (resource: T) => void;
    getIdle: (resource: T) => T;
    getUsed: (resource: T) => T;
    onCreate: (...args: any[]) => T;
}

export class Pool<T = any> {
    protected onIdle: (resource: T) => void;
    protected getIdle: (resource: T) => T;
    protected getUsed: (resource: T) => T;
    protected onCreate: (...args: any[]) => T;

    constructor(args: PoolParams<T>) {
        this.onIdle = args.onIdle;
        this.getIdle = args.getIdle;
        this.getUsed = args.getUsed;
        this.onCreate = args.onCreate;
    }

    beforeAllocate(): void {}
    afterAllocate(): void {}
}
