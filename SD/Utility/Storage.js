
export class Storage {
    constructor() {
        this.version = 0;
        this.storage = [];
    }
 
    store(object) {
        if (this.version + 1 < this.storage.length) {
            this.storage[++this.version] = object;
        } else {
            this.storage.push(object);
            this.version++;
        }
    }

    lastVersion(callback) {
        if (this.version > 0) {
            callback(this.storage[--this.version]);
        }
    }

    nextVersion(callback) {
        if (this.version + 1 < this.storage.length) {
            callback(this.storage[++this.version]);
        }
    }
}