import { SDRule } from "@/Rule/Rule";

type Align = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

/**
 * Aside 规则
 * - "tl"：让子节点位于父节点的上沿左侧
 * - "tc"：让子节点位于父节点的上沿中心
 * - "tr"：让子节点位于父节点的上沿右侧
 * - "lt"：让子节点位于父节点的左沿上侧
 * - "lc"：让子节点位于父节点的左沿中心
 * - "lb"：让子节点位于父节点的左沿下侧
 * - "bl"：让子节点位于父节点的下沿左侧
 * - "bc"：让子节点位于父节点的下沿中心
 * - "br"：让子节点位于父节点的下沿右侧
 * - "rt"：让子节点位于父节点的右沿上侧
 * - "rc"：让子节点位于父节点的右沿中心
 * - "rb"：让子节点位于父节点的右沿下侧
 * @param align 对齐方式
 * @param gap 子节点到父节点的间距，默认为5
 */
export function Aside(align: Align, gap: number): SDRule;
