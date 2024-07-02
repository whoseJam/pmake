
export function naiveY(y) {
    if (y === undefined) {
        return this.member.get("y");
    }
    this.member.setByEqual("y");
    this.tryUpdate();
    return this;
}