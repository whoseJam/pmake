type Align = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

interface AsideLayoutParam {
    align?: Align;
    gap?: number;
}

/**
 * Layout function for positioning a child node beside a parent node.
 *
 * This function positions the child node adjacent to the parent node in one of 12 possible
 * positions around the parent's perimeter, with a configurable gap.
 *
 * @param args - Layout parameters
 *
 * Parameters:
 * - parent: The reference node (required)
 * - child: The node to be positioned (required)
 * - align: Position relative to parent (default: "tc")
 * - gap: Distance between parent and child (default: 5)
 *
 * Alignment modes:
 * Top side:
 * - "tl": Top-left - child's bottom-left aligns with parent's top-left
 * - "tc": Top-center - child's bottom-center aligns with parent's top-center
 * - "tr": Top-right - child's bottom-right aligns with parent's top-right
 *
 * Left side:
 * - "lt": Left-top - child's top-right aligns with parent's top-left
 * - "lc": Left-center - child's center-right aligns with parent's center-left
 * - "lb": Left-bottom - child's bottom-right aligns with parent's bottom-left
 *
 * Bottom side:
 * - "bl": Bottom-left - child's top-left aligns with parent's bottom-left
 * - "bc": Bottom-center - child's top-center aligns with parent's bottom-center
 * - "br": Bottom-right - child's top-right aligns with parent's bottom-right
 *
 * Right side:
 * - "rt": Right-top - child's top-left aligns with parent's top-right
 * - "rc": Right-center - child's center-left aligns with parent's center-right
 * - "rb": Right-bottom - child's bottom-left aligns with parent's bottom-right
 *
 * @example
 * // Position child above parent, centered
 * AsideLayout({
 *   parent: parentNode,
 *   child: childNode,
 *   align: "tc",
 *   gap: 10
 * });
 *
 * @example
 * // Position child to the right of parent, centered vertically
 * AsideLayout({
 *   parent: parentNode,
 *   child: childNode,
 *   align: "rc",
 *   gap: 5
 * });
 *
 * @example
 * // Position child at bottom-left corner
 * AsideLayout({
 *   parent: parentNode,
 *   child: childNode,
 *   align: "bl",
 *   gap: 0
 * });
 */
export function AsideLayout(parent, child, args: AsideLayoutParam) {
    const { align = "tc", gap = 5 } = args;

    // Top side alignments
    if (align === "tl") {
        child.x(parent.x()).my(parent.y() - gap);
    } else if (align === "tc") {
        child.cx(parent.cx()).my(parent.y() - gap);
    } else if (align === "tr") {
        child.mx(parent.mx()).my(parent.y() - gap);
    }
    // Left side alignments
    else if (align === "lt") {
        child.mx(parent.x() - gap).y(parent.y());
    } else if (align === "lc") {
        child.mx(parent.x() - gap).cy(parent.cy());
    } else if (align === "lb") {
        child.mx(parent.x() - gap).my(parent.my());
    }
    // Bottom side alignments
    else if (align === "bl") {
        child.x(parent.x()).y(parent.my() + gap);
    } else if (align === "bc") {
        child.cx(parent.cx()).y(parent.my() + gap);
    } else if (align === "br") {
        child.mx(parent.mx()).y(parent.my() + gap);
    }
    // Right side alignments
    else if (align === "rt") {
        child.x(parent.mx() + gap).y(parent.y());
    } else if (align === "rc") {
        child.x(parent.mx() + gap).cy(parent.cy());
    } else if (align === "rb") {
        child.x(parent.mx() + gap).my(parent.my());
    } else {
        throw new Error(`Invalid Align ${align}`);
    }
}
