import * as sd from "@/sd";

/**
 * 构建Trie树
 * @param {sd.BaseTree} ac 
 * @param {Array<string>} strs 
 * @param {{
 *  OnLink: (nodeU: sd.SDNode, nodeV: sd.SDNode, u: number, v: number) => void
 * }} args
 */
export function BuildTrieTreeSync(ac, strs, args = {}) {
    const R = sd.rule();
    const OnLink = args.OnLink;

    let tot = 1;
    ac.root(1);
    ac.element(1).str = "";
    ac.element(1).acch = {};
    function insert(s) {
        let u = 1;
        for (let i = 0; i < s.length; i++) {
            const cur = ac.element(u);
            if (!cur.acch[s[i]]) {
                cur.acch[s[i]] = ++tot;
                ac.link(u, tot);
                ac.element(u, tot).value(s[i], R.pointAtPathByRate(0.5, "mx", "cy", -5));
                ac.element(tot).str = s.substr(0, i + 1);
                ac.element(tot).acch = {};

                if (OnLink) {
                    OnLink(ac.element(u), ac.element(tot), +u, +tot);
                }
            }
            u = cur.acch[s[i]];
        }
    }
    for (let i = 0; i < strs.length; i++) {
        insert(strs[i]);
    }
    for (let i = 1; i <= tot; i++) {
        ac.element(i).fail = 0;
    }
}
