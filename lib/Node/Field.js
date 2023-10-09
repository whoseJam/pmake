
export function Field(self) {
    self._ = {};

    self.get = function(name, ignore = false) {
        if (self._[name] !== undefined)
            return self._[name];
        if (ignore) return self._[name];
        throw new Error(name + " not found");
    }

    self.set = function(name, value, ignore = false) {
        if (self._[name] === undefined || ignore) {
            self._[name] = value;
            return self;
        }
        if (typeof(self._[name]) !== typeof(value))
            throw new Error(name + " mismatch");
        self._[name] = value;
        return self;
    }

    return self;
}