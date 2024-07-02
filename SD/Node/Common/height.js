
export function naiveHeight(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    this.member.setByEqual("height", height);
    this.tryUpdate();
    return this;
}