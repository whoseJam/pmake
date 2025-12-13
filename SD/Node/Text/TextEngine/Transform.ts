import { match } from "@/Node/Text/TextEngine/Mapping";
import { TextMapping, processMapping } from "@/Node/Text/BaseText";
import { SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { getTextPaths } from "@/Node/Text/TextEngine/Path";
import { Animate as A } from "@/Animate/Animate";
import { transforming } from "@/Node/Text/TextEngine/Transforming";
import { RenderNode } from "@/Renderer/RenderNode";
import { Text } from "@/Node/Text/Text";

export function transformProcess(mapping: TextMapping) {
    return function (source: TextView, target: TextView) {
        return match(source, target, processMapping(mapping));
    };
}

export function transformPostProcess(text: Text, targetLayer: RenderNode) {
    return function (l: number, r: number, source: Array<SubtextView>, target: Array<SubtextView>) {
        for (let i = 0; i < source.length; i++) {
            const sourceSubtext = source[i];
            const targetSubtext = target[i];
            const sourcePaths = getTextPaths(text, l);
            const targetPaths = getTextPaths(text, r);
            const sourceStyles = A.getAttribute(text, "subtextStyles", l, sourceSubtext.getStyle());
            const targetStyles = A.getAttribute(text, "subtextStyles", r, targetSubtext.getStyle());
            transforming(
                text,
                targetLayer,
                l,
                r,
                {
                    styles: sourceStyles,
                    paths: sourcePaths,
                },
                {
                    styles: targetStyles,
                    paths: targetPaths,
                }
            );
        }
    };
}
