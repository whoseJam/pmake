
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