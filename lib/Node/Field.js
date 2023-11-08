
export function Field(self) {
    self._ = {};

    self.get = function(name, ignore = false) {
        if (this._[name] !== undefined)
            return this._[name];
        if (ignore) return this._[name];
        throw new Error(name + " not found");
    }

    self.set = function(name, value, ignore = false) {
        if (this._[name] === undefined || ignore) {
            this._[name] = value;
            return this;
        }
        if (typeof(this._[name]) !== typeof(value))
            throw new Error(name + " mismatch");
        this._[name] = value;
        return this;
    }

    return self;
}