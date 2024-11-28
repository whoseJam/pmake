import * as sd from "@/sd";

/**
 * 构建 Trie 树
 * @param {sd.BaseTree} ac 
 * @param {Array<string>} strs 
 */
export function BuildTrieTree(ac, strs) {
    const R = sd.rule();

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
            }
            u = cur.acch[s[i]];
        }
    }
    strs.forEach(str => insert(str));
    for (let i = 1; i <= tot; i++) {
        ac.element(i).fail = 0;
    }
}

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
 *  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number) => void,
 *  OnFocusParent: (parent: number) => void,
 *  OnRemoveFocusParent: (parent: number) => void,
 *  OnFocusChild: (child: number) => void,
 *  OnRemoveFocusChild: (child: number) => void,
 *  OnFailJumpTo: (fail: number, parent: number) => void,
 *  OnFirstFailJumpTo: (fail: number, parent: number) => void
 * }} args
 */
export async function BuildFailTree(ac, args, skipAll = false) {
    const OnLink = args.OnLink;
    const OnFocusParent = args.OnFocusParent;
    const OnRemoveFocusParent = args.OnRemoveFocusParent;
    const OnFocusChild = args.OnFocusChild;
    const OnRemoveFocusChild = args.OnRemoveFocusChild;
    const OnFailJumpTo = args.OnFailJumpTo;
    const OnFirstFailJumpTo = args.OnFirstFailJumpTo;
    const Q = [1];
    
    while (Q.length > 0) {
        const u = Q[0]; Q.shift();
        
        if (OnFocusParent) {
            if (!skipAll) await sd.pause();
            await OnFocusParent(u);
        }
        const children = ac.children(u);

        for (let i = 0; i < children.length; i++) {
            const v = ac.nodeId(children[i]); Q.push(v);

            if (OnFocusChild) {
                if (!skipAll) await sd.pause();
                await OnFocusChild(v);
            }
            const character = ac.value(u, v).text();
            
            let f = ac.element(u).fail;
            let first = true;
            while (f && !ac.element(f).acch[character]) {
                if (first && OnFirstFailJumpTo) {
                    if (!skipAll) await sd.pause();
                    await OnFirstFailJumpTo(f, u);
                    await OnFailJumpTo(f, u);
                    first = false;
                } else if (OnFailJumpTo) {
                    if (!skipAll) await sd.pause();
                    await OnFailJumpTo(f, u);
                }

                f = ac.element(f).fail;
            }

            if (f && ac.element(f).acch[character]) {
                if (first && OnFirstFailJumpTo) {
                    if (!skipAll) await sd.pause();
                    await OnFirstFailJumpTo(f, u);
                    await OnFailJumpTo(f, u);
                    first = false;
                } else if (OnFailJumpTo) {
                    if (!skipAll) await sd.pause();
                    await OnFailJumpTo(f, u);
                }

                const failOfV = ac.element(f).acch[character];
                if (OnLink) {
                    if (!skipAll) await sd.pause();
                    OnLink(ac.element(v), ac.element(failOfV), +v, +failOfV);
                }
                ac.element(v).fail = failOfV;
            } else {
                if (OnLink) {
                    if (!skipAll) await sd.pause();
                    OnLink(ac.element(v), ac.element(1), +v, 1);
                }
                ac.element(v).fail = 1;
            }

            if (OnRemoveFocusChild) {
                if (!skipAll) await sd.pause();
                await OnRemoveFocusChild(v);
            }
        }

        if (OnRemoveFocusParent) {
            if (!skipAll) await sd.pause();
            await OnRemoveFocusParent(u);
        }
    }
}

export async function MatchOnACMachine(ac, arr, args) {
    await sd.pause();
    const C = sd.color();

    let u = 1;
    const pointer = sd.Pointer(arr);
    const focusU = sd.Focus(ac).startAnimate().focus(u).endAnimate().clickable(false);
    const brace = sd.Brace(arr);

    for (let i = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        pointer.startAnimate().moveTo(i).endAnimate();

        const character = arr.text(i);
        while (u && !ac.element(u).acch[character]) {
            u = ac.element(u).fail;
            const length = ac.depth(u);
            if (u) {
                await sd.pause();
                focusU.startAnimate().focus(u).endAnimate();
                brace.startAnimate().brace(i - length + 1, i - 1).endAnimate();
                arr.startAnimate().color(i, C.orange).endAnimate();
            }
        }
        if (ac.element(u).acch[character]) {
            const length = ac.depth(u) - 2;
            u = ac.element(u).acch[character];
            await sd.pause();
            focusU.startAnimate().focus(u).endAnimate();
            ac.startAnimate().color(u, C.green).endAnimate();
            if (i - length - 1 <= i - 1) brace.startAnimate().brace(i - length - 1, i - 1).endAnimate();
            else brace.startAnimate().opacity(0).endAnimate();

            await sd.pause();
            ac.startAnimate().color(u, C.white).endAnimate();
            arr.startAnimate().color(i, C.white).endAnimate();
            brace.startAnimate().brace(i - length - 1, i).endAnimate();
        } else {
            u = 1;
            brace.startAnimate().opacity(0).endAnimate();
        }
    }
}