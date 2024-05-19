
/**
 * @param {string} x 
 * @returns {number}
 */
export function int(x) {
    return ~~x;
}

/**
 * @overload
 * @param {number} len 
 * @param {number} def 
 * @returns {Array<number>}
 * @overload
 * @param {number}
 * @returns {Array<0>}
 */
export function make1d(len, def = 0) {
    const ans = [];
    for (let i = 1; i <= len; i++)
        ans.push(def);
    return ans;
}

/**
 * @overload
 * @param {number} n 
 * @param {number} m 
 * @param {number} def 
 * @returns {Array<Array<number>>}
 * @overload
 * @param {number} n
 * @param {number} m
 * @returns {Array<Array<0>>}
 */
export function make2d(n, m, def = 0) {
    const ans = [];
    for (let i = 1; i <= n; i++)
        ans.push(make1d(m, def));
    return ans;
}

/**
 * @overload
 * @param {number} n 
 * @param {number} m 
 * @param {number} k 
 * @param {number} def 
 * @returns {Array<Array<Array<number>>>}
 * @overload
 * @param {number} n
 * @param {number} m
 * @param {number} k
 * @returns {Array<Array<Array<0>>>}
 */
export function make3d(n, m, k, def = 0) {
    const ans = [];
    for (let i = 1; i <= n; i++)
        ans.push(make2d(m, k, def));
    return ans;
}
