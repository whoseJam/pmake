
export function OnRightSide(align = "center", margin = 5) {
    let locator = (
        align === "top" ? "y" : 
        align === "center" ? "cy" : 
        align === "bottom" ? "my" : null);
    if (!locator) throw new Error("invalid arguments align = " + align);
    return function(parent, child) {
        child[locator](parent[locator]());
        child.x(parent.mx() + margin);
    }
}

/**
 * 
 * @param {"tl"|"tc"|"tr"|"lt"|"lc"|"lb"|"bl"|"bc"|"br"|"rt"|"rc"|"rb"} align 
 * @param {number} gap 
 * @returns
 */
export function Aside(align = "tc", gap = 5) {
    return (parent, child) => {
        if (align === "tl")      child.x(parent.x()).my(parent.y() - gap);
        else if (align === "tc") child.cx(parent.cx()).my(parent.y() - gap);
        else if (align === "tr") child.mx(parent.mx()).my(parent.y() - gap);
        else if (align === "lt") child.mx(parent.x() - gap).y(parent.y());
        else if (align === "lc") child.mx(parent.x() - gap).cy(parent.cy());
        else if (align === "lb") child.mx(parent.x() - gap).my(parent.my());
        else if (align === "bl") child.x(parent.x()).y(parent.my() + gap);
        else if (align === "bc") child.cx(parent.cx()).y(parent.my() + gap);
        else if (align === "br") child.mx(parent.mx()).y(parent.my() + gap);
        else if (align === "rt") child.x(parent.mx() + gap).y(parent.y());
        else if (align === "rc") child.x(parent.mx() + gap).cy(parent.cy());
        else if (align === "rb") child.x(parent.mx() + gap).my(parent.my());
        else console.error(align);
    }
}