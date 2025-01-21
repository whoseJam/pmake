import * as sd from "@/sd";
import { BuildLenSync } from "./BuildLen";

function validChar(x) {
    return ("a" <= x && x <= "z") || ("A" <= x && x <= "Z");
}

function getString(s) {
    let ans = "";
    let i = s.start();
    while (!validChar(s.text(i))) i++;
    for (; i <= s.end(); i++) ans = ans + s.text(i);
    return ans;
}

function getChar(s, i) {
    if (i > s.end() || i < s.start()) return "empty" + s.id;
    return s.text(i);
}

/**
 *
 * @param {sd.Array} s
 * @param {sd.Array} t
 * @param {{
 *  onPointerIMove(i: number) => void;
 *  onPointerJMove(j: number) => void;
 *  onMatch(i: number, j: number) => void;
 *  onFail(i: number, j: number) => void;
 *  onJumpFail: (i: number, j: number, len: number) => void;
 *  start: number;
 * }} args
 */
export async function KMP(s, t, args) {
    const onPointerIMove = args.onPointerIMove;
    const onPointerJMove = args.onPointerJMove;
    const onMatch = args.onMatch;
    const onFail = args.onFail;
    const onJumpFail = args.onJumpFail;
    const start = args.start ? args.start : 1;

    const len = BuildLenSync(" " + getString(t));
    let j = 0;
    for (let i = start; i <= s.length(); i++) {
        if (onPointerIMove) await onPointerIMove(i);
        if (onPointerJMove) await onPointerJMove(j);

        if (getChar(s, i) === getChar(t, j + 1)) {
            j++;
            if (onMatch) await onMatch(i, j);
        } else {
            if (onFail) await onFail(i, j + 1);
            while (j && getChar(s, i) !== getChar(t, j + 1)) {
                if (onJumpFail) await onJumpFail(i, j, len[j]);
                j = len[j];
            }
            if (getChar(s, i) === getChar(t, j + 1)) {
                j++;
                if (onMatch) await onMatch(i, j);
            } else {
                if (onFail) await onFail(i, j);
            }
        }
    }
}
