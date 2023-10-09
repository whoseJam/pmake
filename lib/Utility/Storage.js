
export function Storage() {
    let version = 0;
    let storage = [];
    let result = {};
    
    result.store = function(obj) {
        if (version + 1 < storage.length) {
            storage[++version] = obj;
        } else {
            storage.push(obj);
            version++;
        }
    }

    result.lastVersion = function(callback) {
        if (version > 0) {
            callback(storage[--version]);
        }
    }

    result.nextVersion = function(callback) {
        if (version + 1 < storage.length) {
            callback(storage[++version]);
        }
    }

    return result;
}