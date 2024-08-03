import { SDNode } from "SD/Node/SDNode";

export function evaluateValue(id: number|string, value: SDNode|undefined|null): SDNode;

/**
 * 判断是否是数字或者字符串
 * @param value 
 */
export function isNumberOrString(value: any): boolean;

/**
 * 判断是否是一个合法的数字
 * 
 * 合法的数字首先是一个数字，其次不包括 Infinity 和 NaN
 * 
 * @param value 
 */
export function isValidNumber(value: any): boolean;
