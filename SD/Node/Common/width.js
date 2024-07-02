
export function naiveWidth(width) {
    if (width === undefined) {
        return this.member.get("width");
    }
    this.member.setByEqual("width", width);
    this.tryUpdate();
    return this;
}