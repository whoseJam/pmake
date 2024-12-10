import * as sd from "@/sd";

/**
 * 
 * @param {sd.BaseTree} ac 
 * @param {sd.BaseArray} arr 
 * @param {{
 *  OnFocusNode: (u: number) => void
 *  OnRemoveFocusNode: (u: number) => void
 *  OnStartMatchAt: (i: number) => void
 *  OnFailJumpTo: (nextFail: number, prevFail: number, i: number) => void
 *  OnMatchExtended: (u: number, i: number) => void
 *  OnMatchFailed: (u: number, i: number) => void
 * }} args 
 */
export async function MatchOnACMachine(ac, arr, args) {
    await sd.pause();
    const C = sd.color();
    const OnFocusNode = args.OnFocusNode;
    const OnRemoveFocusNode = args.OnRemoveFocusNode;
    const OnStartMatchAt = args.OnStartMatchAt;
    const OnFailJumpTo = args.OnFailJumpTo;
    const OnMatchExtended = args.OnMatchExtended;
    const OnMatchFailed = args.OnMatchFailed;

    let u = 1;

    if (OnFocusNode) {
        await OnFocusNode(u);
    }

    for (let i = arr.start(); i <= arr.end(); i++) {
        if (OnStartMatchAt) {
            await OnStartMatchAt(i);
        }

        const character = arr.text(i);
        while (u && !ac.element(u).acch[character]) {
            if (OnFailJumpTo) {
                await OnFailJumpTo(ac.element(u).fail, u, i);
            }
            u = ac.element(u).fail;
        }
        if (ac.element(u).acch[character]) {
            u = ac.element(u).acch[character];
            if (OnMatchExtended) {
                await OnMatchExtended(u, i);
            }
        } else {
            u = 1;
            if (OnMatchFailed) {
                await OnMatchFailed(u, i);
            }
        }
    }
}
