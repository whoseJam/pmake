import { SDNode } from "SD/Node/SDNode";

type LocationType = "lt"|"lc"|"lb"|"tl"|"tc"|"tr"|"bl"|"bc"|"br"|"rt"|"rc"|"rb";

interface LabelType extends SDNode {
}

/**
 * 构建一个标签
 * @param parent 
 * @param text 标签的文本
 * @param position 标签相对于父节点的位置 
 * @param fontSize 标签字体大小
 * @param gap 标签到父组件的间距
 */
export function Label(parent: any, text: string, position: LocationType, fontSize: number, gap: number): LabelType;

export function MathjaxLabel(parent: any, text: string, position: LocationType, fontSize: number, gap: number): LabelType;