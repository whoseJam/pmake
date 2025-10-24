import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Pool } from "@/Utility/Pool/Pool";

type PoolStatus = "idle" | "used" | "using";

interface PoolResource {
    __pool_status: PoolStatus;
    [key: string]: any;
}

interface ObjectPoolParams<T = any> {
    onIdle: (resource: T) => void;
    getIdle: (resource: T) => T;
    getUsed: (resource: T) => T;
    onCreate: (key: number | string) => T;
}

export class ObjectPool<T extends PoolResource = any> extends Pool<T> {
    protected resources: Record<string | number, T>;

    constructor(args: ObjectPoolParams<T>) {
        super(args);
        this.resources = {};
    }

    beforeAllocate(): void {
        for (const key in this.resources) {
            const resource = this.resources[key];
            if (resource.__pool_status === "using") {
                resource.__pool_status = "used";
            }
        }
    }

    allocate(key: number | string): T {
        const resource = this.resources[key];
        if (!resource) {
            const resource = this.onCreate(key);
            this.resources[key] = resource;
            resource.__pool_status = "using";
            return this.getIdle(resource);
        }
        if (resource.__pool_status === "using") ErrorLauncher.whatHappened();
        if (resource.__pool_status === "used") {
            resource.__pool_status = "using";
            return this.getUsed(resource);
        } else {
            resource.__pool_status = "using";
            return this.getIdle(resource);
        }
    }

    afterAllocate(): void {
        for (const key in this.resources) {
            const resource = this.resources[key];
            if (resource.__pool_status === "used") {
                resource.__pool_status = "idle";
                this.onIdle(resource);
            }
        }
    }

    isUsing(key: number | string): boolean {
        const resource = this.resources[key];
        return resource && resource.__pool_status === "using";
    }

    get(key: number | string): T | undefined {
        const resource = this.resources[key];
        return resource;
    }
}
