import * as sd from "@/sd";


/**
 * @param {sd.Array} str 
 * @param {{
 *  OnIMoveTo: (i: number) => void
 *  OnCheckMirrorSymmetry: (center: number, length: number) => void
 *  OnILengthInitialized: (i: number, length: number) => void
 *  OnILengthExtended: (i: number, length: number) => void
 *  OnILengthCalcFinished: (i: number, length: number) => void
 *  OnMirrorSymmetryCenterUpdated: (center: number, length: number) => void
 * }} args
 */
export async function Manacher(str, args) {
    const OnIMoveTo = args.OnIMoveTo;
    const OnCheckMirrorSymmetry = args.OnCheckMirrorSymmetry;
    const OnILengthInitialized = args.OnILengthInitialized;
    const OnILengthExtended = args.OnILengthExtended;
    const OnILengthCalcFinished = args.OnILengthCalcFinished;
    const OnMirrorSymmetryCenterUpdated = args.OnMirrorSymmetryCenterUpdated;

    const len = sd.make1d(str.length() * 5, 1);

    await sd.pause();
    const cx = str.cx();
    let data = "";
    for (let i = str.start(); i <= str.end(); i++)
        data = data + str.text(i);
    str.startAnimate();
    str.freeze();
    str.insert(0, "{");
    str.insert(1, "#");
    for (let i = 1; i < data.length; i++) {
        str.insert(i * 2 + 1, "#");
    }
    str.push("#").push("}").cx(cx);
    str.unfreeze();
    str.endAnimate();

    let max = 0, pos = 0;

    if (OnIMoveTo) {
        await OnIMoveTo(str.start());
    }
    for (let i = str.start() + 1; i <= str.end(); i++) {
        if (OnIMoveTo) {
            await OnIMoveTo(i);
        }

        if (max > i) {
            if (OnCheckMirrorSymmetry) {
                await OnCheckMirrorSymmetry(pos * 2 - i, len[pos * 2 - i]);
            }
            len[i] = Math.min(len[pos * 2 - i], max - i);
        } else len[i] = 1;
        
        if (OnILengthInitialized) {
            await OnILengthInitialized(i, len[i]);
        }

        while (i + len[i] <= str.end() && i - len[i] >= str.start() && str.text(i + len[i]) == str.text(i - len[i])) {
            len[i]++;
            if (OnILengthExtended) {
                await OnILengthExtended(i, len[i]);
            }
        }

        if (max < i + len[i]) {
            max = i + len[i];
            pos = i;
            if (OnMirrorSymmetryCenterUpdated) {
                await OnMirrorSymmetryCenterUpdated(i, len[i]);
            }
        }

        if (OnILengthCalcFinished) {
            await OnILengthCalcFinished(i, len[i]);
        }
    }
}