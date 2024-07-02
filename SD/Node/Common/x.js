
export function naiveX(x) {
    if (x === undefined) {
        return this.member.get("x");
    }
    this.member.setByEqual("x");
    this.tryUpdate();
    return this;
}