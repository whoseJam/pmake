import * as sd from "@/sd";

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
*  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number) => void
* }} args
*/
export function BuildFailTreeSync(ac, args) {
    const OnLink = args.OnLink;
    const Q = [1];
    
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        
        const children = ac.children(u);

        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]); Q.push(v);
            const character = ac.value(u, v).text();
            
            let f = ac.element(u).fail;
            while (f && !ac.element(f).acch[character]) {
                f = ac.element(f).fail;
            }

            if (f && ac.element(f).acch[character]) {
                const failOfV = ac.element(f).acch[character];
                if (OnLink) {
                    OnLink(ac.element(v), ac.element(failOfV), +v, +failOfV);
                }
                ac.element(v).fail = failOfV;
            } else {
                if (OnLink) {
                    OnLink(ac.element(v), ac.element(1), +v, 1);
                }
                ac.element(v).fail = 1;
            }
        }
    }
}