import { match } from "@/Node/Text/TextEngine/Mapping";
import { TextMapping, processMapping } from "@/Node/Text/BaseText";
import { PathStyle, SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { getTextPaths } from "@/Node/Text/TextEngine/Path";
import { RenderNode } from "@/Renderer/RenderNode";
import { Text } from "@/Node/Text/Text";
import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Animate as A } from "@/Animate/Animate";

export function transformProcess(mapping: TextMapping) {
    return function (source: TextView, target: TextView) {
        return match(source, target, processMapping(mapping));
    };
}

export function transformPostProcess(text: Text, targetLayer: RenderNode) {
    return function (l: number, r: number, source: Array<SubtextView>, target: Array<SubtextView>) {
        const createAction = (character: RenderNode, source: any, target: any, interp: any, animatedKey: string) => {
            new Action(
                l,
                r,
                source,
                target,
                interp(character, animatedKey),
                this.timingFunction,
                character,
                animatedKey
            );
        };

        const sourcePaths = getTextPaths(text, l);
        const targetPaths = getTextPaths(text, r);
        for (let i = 0; i < source.length; i++) {
            const sourceSubtext = source[i];
            const targetSubtext = target[i];
            const sourceStyles: Array<PathStyle> = A.getAttribute(text, "subtextStyles", l, sourceSubtext.getStyle());
            const targetStyles: Array<PathStyle> = A.getAttribute(text, "subtextStyles", r, targetSubtext.getStyle());
            const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
            const mapping = buildMapping(sourceSubtext.count(), targetSubtext.count());
            for (const [sourceIndex, targetIndex] of mapping) {
                const character = RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
                const source = sourcePaths[sourceIndex];
                const target = targetPaths[targetIndex];
                if (sourceIndex === undefined) {
                    character.setAttribute("d", target.d);
                    createAction(character, 0, 1, Interp.numberInterp, "opacity");
                    continue;
                } else if (targetIndex === undefined) {
                    character.setAttribute("d", source.d);
                    createAction(character, 1, 0, Interp.numberInterp, "opacity");
                    continue;
                } else if (source === undefined && target === undefined) {
                    continue;
                } else if (source === undefined) {
                    character.setAttribute("d", target.d);
                    createAction(character, 0, 1, Interp.numberInterp, "opacity");
                    continue;
                } else if (target === undefined) {
                    character.setAttribute("d", source.d);
                    createAction(character, 1, 0, Interp.numberInterp, "opacity");
                    continue;
                }
                character.setAttribute("d", source.d);
                createAction(character, source.d, target.d, Interp.pathInterp, "d");
                const sourceStyle = sourceStyles[sourceIndex].styleAt(text, l);
                const targetStyle = targetStyles[targetIndex].styleAt(text, r);
                createAction(character, sourceStyle.fill, targetStyle.fill, Interp.colorInterp, "fill");
                createAction(character, sourceStyle.stroke, targetStyle.stroke, Interp.colorInterp, "stroke");
                createAction(
                    character,
                    sourceStyle.strokeWidth,
                    targetStyle.strokeWidth,
                    Interp.numberInterp,
                    "stroke-width"
                );
            }
            group.__animate(r, r).remove();
        }
    };
}

function buildMapping(sourceCount: number, targetCount: number): Array<[number, number]> {
    const mapping: Array<[number, number]> = [];
    if (sourceCount < targetCount) {
        const count = targetCount - sourceCount;
        const gap = Math.floor(sourceCount / count);
        if (sourceCount === 0) {
            for (let i = 0; i < targetCount; i++) mapping.push([undefined, i]);
            return mapping;
        }
        if (gap > 0) {
            let current = 0;
            for (let i = 0; i < sourceCount - 1; i++) {
                if (i % gap === 0 && current < count) {
                    mapping.push([i, mapping.length]);
                    current++;
                }
                mapping.push([i, mapping.length]);
            }
            return mapping;
        }
        if (gap === 0) {
            let current = 0;
            const copy = Math.ceil(count / sourceCount);
            for (let i = 0; i < sourceCount; i++) {
                for (let j = 1; j <= copy && current < count; j++) {
                    mapping.push([i, mapping.length]);
                    current++;
                }
                mapping.push([i, mapping.length]);
            }
            return mapping;
        }
    }
    if (sourceCount === targetCount) {
        for (let i = 0; i < sourceCount; i++) mapping.push([i, i]);
        return mapping;
    }
    if (sourceCount > targetCount) {
        const count = sourceCount - targetCount;
        const gap = Math.floor(targetCount / count);
        if (targetCount === 0) {
            for (let i = 0; i < targetCount; i++) mapping.push([i, undefined]);
            return mapping;
        }
        if (gap > 0) {
            let current = 0;
            for (let i = 0; i < targetCount; i++) {
                if (i % gap === 0 && current < count) {
                    mapping.push([mapping.length, i]);
                    current++;
                }
                mapping.push([mapping.length, i]);
            }
            return mapping;
        }
        if (gap === 0) {
            let current = 0;
            const copy = Math.ceil(count / targetCount);
            for (let i = 0; i < targetCount; i++) {
                for (let j = 1; j <= copy && current < count; j++) {
                    mapping.push([mapping.length, i]);
                    current++;
                }
                mapping.push([mapping.length, i]);
            }
            return mapping;
        }
    }
}
