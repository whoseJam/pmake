// @ts-check
import { LinkBase } from "../Node/Basic/LinkBase";
import { SDNode } from "../Node/Node";

/**
 * @param {LinkBase} link 
 * @param {SDNode} from 
 * @param {SDNode} to 
 */
export function trim(link, from, to) {
    try {
        let vf = 0, vt = 0;
        {   let l = 0, r = 1;
            while (r - l > 0.001) {
                const mid = (l + r) / 2.0;
                if (from.inRange(link.at(mid))) l = mid;
                else r = mid;
            } vf = l;
        }
        {   let l = 0, r = 1;
            while (r - l > 0.001) {
                const mid = (l + r) / 2.0;
                if (to.inRange(link.at(mid))) r = mid;
                else l = mid;
            } vt = l;
        }
        const source = link.at(vf);
        const target = link.at(vt);
        link.source(source[0], source[1]);
        link.target(target[0], target[1]);
    } catch(e) {
        console.warn(e);
    }
}
