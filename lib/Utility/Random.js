import { int } from "./Util.ts";

export function rand(l, r) {
    l = int(l);
    r = int(r);
    let ans = Math.floor(Math.random() * (r - l + 2));
    return Math.min(Math.max(l + ans, l), r);
}
