import { Rule } from "./Rule";

type AlignType = "tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb";

/**
 * 获取一个Aside规则
 * @param align 对齐方式
 * @param gap 子节点到父节点的间距，默认为5
 */
export function Aside(align: AlignType, gap: number): Rule;