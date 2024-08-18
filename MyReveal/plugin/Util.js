export function ReplaceElement(parent, oldElement, newElement) {
    CopyStyles(oldElement, newElement);
    parent.insertBefore(newElement, oldElement.previousSibling);
    parent.removeChild(oldElement);
}

function CopyStyles(source, target) {
    const style = source.getAttribute("style");
    target.setAttribute("style", style);
}