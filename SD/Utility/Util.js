
export function int(x) {
    return ~~x;
}

export function make1d(length, defaultValue = 0) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(defaultValue);
    } 
    return result;
}

export function make2d(rows, columns, defaultValue = 0) {
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push(make1d(columns, defaultValue));
    }
    return result;
}