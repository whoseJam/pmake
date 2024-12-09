import * as sd from "@/sd";

/**
 * 构建Trie图
 * @param {sd.BaseTree} ac
 * @param {{
*  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number, character: string, creatChild: boolean) => void,
*  OnFocusParent: (parent: number) => void,
*  OnRemoveFocusParent: (parent: number) => void,
*  OnFocusChild: (child: number) => void,
*  OnRemoveFocusChild: (child: number) => void,
* }} args
*/
export async function BuildTrieGraph(ac, characterSet, args, skipAll = false) {
    const OnLink = args.OnLink;
    const OnFocusParent = args.OnFocusParent;
    const OnRemoveFocusParent = args.OnRemoveFocusParent;
    const OnFocusChild = args.OnFocusChild;
    const OnRemoveFocusChild = args.OnRemoveFocusChild;
    const Q = [1];
    
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        if (OnFocusParent) {
            await OnFocusParent(u);
        }

        for (let i = 0; i < characterSet.length; i++) {
            const character = characterSet[i];
            const v = GetChild(u, character);
            const fail = ac.element(u).fail;
            const next = Math.max(GetChild(fail, character), 1);
            if (!v) {
                SetChild(u, character, next);
                
                if (OnLink) {
                    await OnLink(ac.element(u), ac.element(next), +u, +next, character);
                }
            } else {
                if (OnFocusChild) {
                    await OnFocusChild(v);
                }

                Q.push(v);
                ac.element(v).fail = next;

                if (OnLink) {
                    await OnLink(ac.element(v), ac.element(next), +v, +next);
                }

                if (OnRemoveFocusChild) {
                    await OnRemoveFocusChild(v);
                }
            }
        }

        if (OnRemoveFocusParent) {
            await OnRemoveFocusParent(u);
        }
    }
    function GetChild(u, character) {
        if (!u) return 0;
        return ac.element(u).acch[character];
    }
    function SetChild(u, character, v) {
        if (!u) return 0;
        ac.element(u).acch[character] = v;
    }
}