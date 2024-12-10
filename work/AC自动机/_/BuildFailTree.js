import * as sd from "@/sd";

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
*  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number) => void
*  OnFocusParent: (parent: number) => void
*  OnRemoveFocusParent: (parent: number) => void
*  OnFocusChild: (child: number) => void
*  OnRemoveFocusChild: (child: number) => void
*  OnFailJumpTo: (fail: number, parent: number) => void
* }} args
*/
export async function BuildFailTree(ac, args, skipAll = false) {
    const OnLink = args.OnLink;
    const OnFocusParent = args.OnFocusParent;
    const OnRemoveFocusParent = args.OnRemoveFocusParent;
    const OnFocusChild = args.OnFocusChild;
    const OnRemoveFocusChild = args.OnRemoveFocusChild;
    const OnFailJumpTo = args.OnFailJumpTo;
    const Q = [1];
    
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        
        if (OnFocusParent) {
            await OnFocusParent(u);
        }
        const children = ac.children(u);

        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]); Q.push(v);

            if (OnFocusChild) {
                await OnFocusChild(v);
            }
            const character = ac.value(u, v).text();
            
            let f = ac.element(u).fail;
            let first = true;
            while (f && !ac.element(f).acch[character]) {
                    if (OnFailJumpTo) {
                        await OnFailJumpTo(f, u, first);
                        first = false;
                    }
                f = ac.element(f).fail;
            }

            if (f && ac.element(f).acch[character]) {
                if (OnFailJumpTo) {
                    await OnFailJumpTo(f, u, first);
                    first = false;
                }

                const failOfV = ac.element(f).acch[character];
                if (OnLink) {
                    await OnLink(ac.element(v), ac.element(failOfV), +v, +failOfV);
                }
                ac.element(v).fail = failOfV;
            } else {
                if (OnLink) {
                    await OnLink(ac.element(v), ac.element(1), +v, 1);
                }
                ac.element(v).fail = 1;
            }

            if (OnRemoveFocusChild) {
                await OnRemoveFocusChild(v);
            }
        }

        if (OnRemoveFocusParent) {
            await OnRemoveFocusParent(u);
        }
    }
}