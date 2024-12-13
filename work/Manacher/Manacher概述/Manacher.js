import * as sd from "@/sd";
import { Manacher } from "../_/Manacher";

const svg = sd.svg();
// const data = "abbabbabaaaba";
const data = "aaaaabaa";
const str = new sd.Array(svg);
const pos = sd.Pointer(str, "pos", "b", 15, 20, 3);
const idx = sd.Pointer(str, "i", "b", 15, 40, 3);
const mirror = sd.Brace(str);
const mirrorCenter = sd.Brace(str);
const current = sd.Brace(str);

sd.init(() => {
    str.pushArray(data);
    str.cx(600).cy(300);
})

sd.main(async () => {
    await Manacher(str, {
        OnIMoveTo: OnIMoveTo,
        OnCheckMirrorSymmetry: OnCheckMirrorSymmetry,
        OnILengthInitialized: OnILengthUpdated,
        OnILengthExtended: OnILengthUpdated,
        OnMirrorSymmetryCenterUpdated: OnMirrorSymmetryCenterUpdated,
        OnILengthCalcFinished: async () => {
            await sd.pause();
            mirror.startAnimate().opacity(0).endAnimate();
            current.startAnimate().opacity(0).endAnimate();
        }
    });
})

async function OnIMoveTo(i) {
    await sd.pause();
    str.startAnimate();
    idx.moveTo(i);
    str.endAnimate();
}

async function OnCheckMirrorSymmetry(center, length) {
    await sd.pause();
    mirror.startAnimate().brace(center - length + 1, center + length - 1, "b", 5).endAnimate();
    current.after(mirror).brace(center - length + 1, center + length - 1, "b", 5);
}

async function OnILengthUpdated(i, length) {
    await sd.pause();
    current.startAnimate().brace(i - length + 1, i + length - 1, "b", 15).endAnimate();
}

async function OnMirrorSymmetryCenterUpdated(center, length) {
    await sd.pause();
    str.startAnimate();
    pos.moveTo(center);
    mirrorCenter.brace(center - length + 1, center + length - 1);
    str.endAnimate();
}