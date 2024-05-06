// @ts-check
import * as sd from "../lib/slide";

/**
 * @description 对两个数字进行相加
 * @overload
 * @param {number} x - 第一个数字
 * @param {number} y - 第二个数字
 * @returns {number} 两个数字相加的结果
 * 
 * @description 将两个字符串进行拼接
 * @overload
 * @param {string} x - 第一个字符串
 * @param {string} y - 第二个字符串
 * @returns {string} 两个字符串拼接的结果
 */
function addOrConcatenate(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      return x + y;
    } else if (typeof x === 'string' && typeof y === 'string') {
      return x + y;
    }
}

addOrConcatenate(1, 2)

let svg = sd.svg();
const t = new sd.Tree(svg);

const e = t.element(1, 2);
t.value(1, "hello");

main();

async function main() {

}