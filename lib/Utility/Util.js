
export function int(x) {
    return ~~x;
}

export function make1d(len, def = 0) {
    let ans = [];
    for (let i = 1; i <= len; i++)
        ans.push(def);
    return ans;
}

export function make2d(n, m, def = 0) {
    let ans = [];
    for (let i = 1; i <= n; i++)
        ans.push(make1d(m, def));
    return ans;
}
