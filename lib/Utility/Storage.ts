
export class Storage {
    version: number = 0;
    storage: Array<any> = [];

    store(object: any) {
        if (this.version + 1 < this.storage.length) {
            this.storage[++this.version] = object;
        } else {
            this.storage.push(object);
            this.version++;
        }
    }

    lastVersion(callback: (object: any) => void) {
        if (this.version > 0) {
            callback(this.storage[--this.version]);
        }
    }

    nextVersion(callback: (object: any) => void) {
        if (this.version + 1 < this.storage.length) {
            callback(this.storage[++this.version]);
        }
    }
}