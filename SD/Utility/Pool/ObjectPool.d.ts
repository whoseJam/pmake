interface ObjectPoolParams {
    onIdle: (resource: any) => void;
    getIdle: (resource: any) => any;
    getUsed: (resource: any) => any;
    onCreate: (key: number | string) => any;
}

export class ObjectPool {
    constructor(args: ObjectPoolParams);
    allocate(key: number | string): any;
}
