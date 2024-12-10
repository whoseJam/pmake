import * as sd from "@/sd";

/**
 * 构建Trie图
 * @param {sd.BaseTree} ac
 * @param {{
*  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number, character: string) => void
* }} args
*/
export function BuildTrieGraphSync(ac, characterSet, args, skipAll = false) {
    const OnLink = args.OnLink;
    const Q = [1];
    
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();

        for (let i = 0; i < characterSet.length; i++) {
            const character = characterSet[i];
            const v = GetChild(u, character);
            const fail = ac.element(u).fail;
            const next = Math.max(GetChild(fail, character), 1);
            if (!v) {
                SetChild(u, character, next);
                
                if (OnLink) {
                    OnLink(ac.element(u), ac.element(next), +u, +next, character);
                }
            } else {
                Q.push(v);
                ac.element(v).fail = next;

                if (OnLink) {
                    OnLink(ac.element(v), ac.element(next), +v, +next);
                }
            }
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