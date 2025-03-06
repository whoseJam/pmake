import { SDRule } from "@/Rule/Rule";

type Align = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

/**
 * aside 布局规则，该规则定义了子节点相对于父节点的不同对齐方式。
 *
 * 每个对齐规则使用两个字符的缩写表示，第一个字符表示子节点相对于父节点的主要方向（上、下、左、右），
 * 第二个字符表示子节点在该方向上的具体位置（左、中、右、上、下）。
 *
 * 具体的对齐规则如下：
 * - "tl"：Top Left，子节点位于父节点的上沿左侧。
 * - "tc"：Top Center，子节点位于父节点的上沿中心。
 * - "tr"：Top Right，子节点位于父节点的上沿右侧。
 * - "lt"：Left Top，子节点位于父节点的左沿上侧。
 * - "lc"：Left Center，子节点位于父节点的左沿中心。
 * - "lb"：Left Bottom，子节点位于父节点的左沿下侧。
 * - "bl"：Bottom Left，子节点位于父节点的下沿左侧。
 * - "bc"：Bottom Center，子节点位于父节点的下沿中心。
 * - "br"：Bottom Right，子节点位于父节点的下沿右侧。
 * - "rt"：Right Top，子节点位于父节点的右沿上侧。
 * - "rc"：Right Center，子节点位于父节点的右沿中心。
 * - "rb"：Right Bottom，子节点位于父节点的右沿下侧。
 *
 * @param align 子节点相对于父节点的对齐方式，必须是上述定义的 12 种对齐规则之一。
 * @param gap 子节点到父节点的间距，单位根据具体布局环境而定，默认为 5。
 */
export function aside(align: Align, gap: number): SDRule;
