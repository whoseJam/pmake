export function linkTo(link, color) {
    const clazz = link.constructor;
    const clone = new clazz(link);
    clone.freeze();
    clone.source(link.source());
    clone.target(link.target());
    clone.unfreeze();
    clone.color(color).strokeWidth(2.5).startAnimate().pointStoT().endAnimate();
    if (link.markerEnd()) clone.arrow();
    return clone;
}
