import { match } from "@/Node/Text/TextEngine/Mapping";
import { TextMapping, processMapping } from "@/Node/Text/BaseText";
import { createTextView, PathStyle, SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { getTextPaths } from "@/Node/Text/TextEngine/Path";
import { Animate as A } from "@/Animate/Animate";
import { transforming } from "@/Node/Text/TextEngine/Transforming";
import { RenderNode } from "@/Renderer/RenderNode";
import { Text } from "@/Node/Text/Text";
import { Action } from "@/Animate/Action";

export function typewritterProcess() {
    return function (source: TextView, target: TextView): Array<[SubtextView, SubtextView]> {
        return [[source.asSubtextView(), target.asSubtextView()]];
    };
}

export function typewritterPostProcess(text: Text, targetLayer: RenderNode) {
    return function (l: number, r: number, source: Array<SubtextView>, target: Array<SubtextView>) {
        const sourceSubtext = source[0];
        const targetSubtext = target[0];

        const paths = getTextPaths(text, r);
        const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
        const characters = [];
        for (const path of paths) {
            const character = RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
            character.setAttribute("d", path.d);
            characters.push(character);
        }

        new Action(
            l,
            r,
            0,
            1,
            function (t: number) {
                const time = 1.0 / characters.length;
                for (let i = 0; i < characters.length; i++) {
                    const k = this.reverse ? (characters.length - i - 0.5) * time : (i + 0.5) * time;
                    if (t >= k) characters[i].setAttribute("opacity", this.target);
                    else characters[i].setAttribute("opacity", this.source);
                }
            },
            text._.timingFunction,
            text,
            "typewritter"
        );
    };
}
