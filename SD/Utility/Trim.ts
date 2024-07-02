// @ts-ignore
import { LinkBase } from "@/Node/Basic/LinkBase";
// @ts-ignore
import { SDNode } from "@/Node/SDNode";

function trimFrom(link: LinkBase, from: SDNode|null|undefined): number {
    if (!from) {
        return 0;
    }
    let l = 0, r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (from.inRange(link.at(mid))) {
            l = mid;
        } else {
            r = mid;
        }
    }
    return l;
}

function trimTo(link: LinkBase, to: SDNode|null|undefined): number {
    if (!to) {
        return 1;
    }
    let l = 0, r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (to.inRange(link.at(mid))) {
            r = mid;
        } else {
            l = mid;
        }
    }
    return l;
}

export function trim(link: LinkBase, from: SDNode|null|undefined, to: SDNode|null|undefined) {
    link.update();
    const f = trimFrom(link, from);
    const t = trimTo(link, to);
    const source = link.at(f);
    const target = link.at(t);
    link.source(source[0], source[1])
        .target(target[0], target[1]);
}