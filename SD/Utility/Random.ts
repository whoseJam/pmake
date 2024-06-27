import { int } from "./Util";

export function rand(l: any, r: any): number {
    l = int(l);
    r = int(r);
    let ans = Math.floor(Math.random() * (r - l + 2));
    return Math.min(Math.max(l + ans, l), r);
}