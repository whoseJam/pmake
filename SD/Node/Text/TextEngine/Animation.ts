import { Action } from "@/Animate/Action";
import { Text } from "@/Node/Text/Text";
import { createTextView, PathStyle, SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { RenderNode } from "@/Renderer/RenderNode";
import { LazyInterpFunction } from "@/Animate/Interp";

export function buildAnimation(
    text: Text,
    source: { text: string; styles?: Array<PathStyle>; backing?: RenderNode },
    target: { text: string; backing?: RenderNode },
    process: (sourceView: TextView, targetView: TextView) => Array<[SubtextView, SubtextView]>,
    postProcess: LazyInterpFunction,
    animatedKey: string
) {
    const sourceView = createTextView(source.text, { styles: source.styles, backing: source.backing });
    const targetView = createTextView(target.text, { backing: target.backing });
    const mappings = process(sourceView, targetView);
    const l = text.delay();
    const r = text.delay() + text.duration();
    new Action(
        l,
        r,
        mappings.map(mapping => mapping[0]),
        mappings.map(mapping => mapping[1]),
        postProcess,
        text._.timingFunction,
        text,
        "text:" + animatedKey
    );
    return targetView.styles;
}
