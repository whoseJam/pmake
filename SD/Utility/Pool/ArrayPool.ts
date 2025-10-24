import { Pool } from "./Pool";

type PoolStatus = "idle" | "used" | "using";

interface PoolResource {
    __pool_status: PoolStatus;
    [key: string]: any;
}

interface ArrayPoolParams<T = any> {
    onIdle: (resource: T) => void;
    getIdle: (resource: T) => T;
    getUsed: (resource: T) => T;
    onCreate: () => T;
}

export class ArrayPool<T extends PoolResource = any> extends Pool<T> {
    protected resources: T[];

    constructor(args: ArrayPoolParams<T>) {
        super(args);
        this.resources = [];
    }

    beforeAllocate(): void {
        for (const resource of this.resources) {
            if (resource.__pool_status === "using") {
                resource.__pool_status = "used";
            }
        }
    }

    allocate(): T {
        for (let i = 0; i < this.resources.length; i++) {
            const resource = this.resources[i];
            if (resource.__pool_status === "using") continue;
            if (resource.__pool_status === "used") {
                resource.__pool_status = "using";
                return this.getUsed(resource);
            } else {
                resource.__pool_status = "using";
                return this.getIdle(resource);
            }
        }
        const resource = this.onCreate();
        this.resources.push(resource);
        resource.__pool_status = "using";
        return this.getIdle(resource);
    }

    afterAllocate(): void {
        for (const resource of this.resources) {
            if (resource.__pool_status === "used") {
                resource.__pool_status = "idle";
                this.onIdle(resource);
            }
        }
    }
}
