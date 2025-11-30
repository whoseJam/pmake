import { Action } from "@/Animate/Action";
import { Animate as A } from "@/Animate/Animate";
import { TextMapping } from "@/Node/Text/BaseText";
import { Text } from "@/Node/Text/Text";
import { match } from "@/Node/Text/TextEngine/Mapping";
import { getTextPaths } from "@/Node/Text/TextEngine/Path";
import { createTextView, PathStyle } from "@/Node/Text/TextEngine/TextView";
import { transforming } from "@/Node/Text/TextEngine/Transforming";
import { RenderNode } from "@/Renderer/RenderNode";

export function buildTransforming(
    text: Text,
    source: {
        text: string;
        styles?: Array<PathStyle>;
        backing?: RenderNode;
    },
    target: {
        text: string;
        backing?: RenderNode;
    },
    mapping: TextMapping,
    targetLayer: RenderNode
) {
    const sourceView = createTextView(source.text, { styles: source.styles, backing: source.backing });
    const targetView = createTextView(target.text, { backing: target.backing });
    const matchings = match(sourceView, targetView, mapping);
    const callback = (l: number, r: number, source: any, target: any) => {
        for (const matching of matchings) {
            const [sourceSubtextView, targetSubtextView] = matching;
            const sourcePaths = getTextPaths(text, l);
            const targetPaths = getTextPaths(text, r);
            const sourceStyles = A.getAttribute(text, "subtextStyles", l, sourceSubtextView.getStyle());
            const targetStyles = A.getAttribute(text, "subtextStyles", r, targetSubtextView.getStyle());
            console.log("queryStyle=", targetStyles);
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
    const l = text.delay();
    const r = text.delay() + text.duration();
    new Action(l, r, undefined, undefined, callback, text._.timingFunction, text, "text:transforming");
    return targetView.styles;
}
