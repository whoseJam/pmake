import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { TimingFunction as T } from "@/Math/TimingFunction";
import { Text } from "@/Node/Text/Text";
import { PathStyle, PathView } from "@/Node/Text/TextEngine/TextView";
import { RenderNode } from "@/Renderer/RenderNode";

function sourcePrepare(
    sourcePaths: Array<PathView>,
    sourceStyles: Array<PathStyle>,
    targetPaths: Array<PathView>,
    targetStyles: Array<PathStyle>
): [Array<PathView>, Array<PathStyle>] {
    const length = targetPaths.length;
    const sourcePaths_ = [];
    const sourceStyles_ = [];
    const count = length - sourcePaths.length;
    const gap = Math.floor(sourcePaths.length / count);
    if (sourcePaths.length === 0) {
        for (let i = targetPaths.length - 1; i >= 0; i--) {
            sourcePaths.push(targetPaths[i].clone("opacity:0->1"));
            sourceStyles.push(targetStyles[i].clone());
        }
    } else if (gap > 0) {
        let current = 0;
        for (let i = sourcePaths.length - 1; i >= 0; i--) {
            if ((sourcePaths.length - 1 - i) % gap === 0 && current < count) {
                sourcePaths_.push(sourcePaths[i].clone());
                sourceStyles_.push(sourceStyles[i].clone());
                current++;
            }
            sourcePaths_.push(sourcePaths[i]);
            sourceStyles_.push(sourceStyles[i]);
        }
    } else {
        let current = 0;
        const copy = Math.ceil(count / sourcePaths.length);
        for (let i = sourcePaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= copy && current < count; j++) {
                sourcePaths_.push(sourcePaths[i].clone());
                sourceStyles_.push(sourceStyles[i].clone());
                current++;
            }
            sourcePaths_.push(sourcePaths[i]);
            sourceStyles_.push(sourceStyles[i]);
        }
    }
    return [sourcePaths_.reverse(), sourceStyles_.reverse()];
}

function targetPrepare(
    sourcePaths: Array<PathView>,
    sourceStyles: Array<PathStyle>,
    targetPaths: Array<PathView>,
    targetStyles: Array<PathStyle>
): [Array<PathView>, Array<PathStyle>] {
    const targetPaths_ = [];
    const targetStyles_ = [];
    const count = sourcePaths.length - targetPaths.length;
    const gap = Math.floor(targetPaths.length / count);
    if (targetPaths.length === 0) {
        for (let i = 0; i < sourcePaths.length; i++) {
            sourcePaths[i].status = "opacity:1->0";
        }
    } else if (gap > 0) {
        let current = 0;
        for (let i = targetPaths.length - 1; i >= 0; i--) {
            if ((targetPaths.length - 1 - i) % gap === 0 && current < count) {
                targetPaths_.push(targetPaths[i].clone());
                targetStyles_.push(targetStyles[i].clone());
                current++;
            }
            targetPaths_.push(targetPaths[i]);
            targetStyles_.push(targetStyles[i]);
        }
    } else {
        let current = 0;
        const copy = Math.ceil(count / targetPaths.length);
        for (let i = targetPaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= copy && current < count; j++) {
                targetPaths_.push(targetPaths[i].clone());
                targetStyles_.push(targetStyles[i].clone());
                current++;
            }
            targetPaths_.push(targetPaths[i]);
            targetStyles_.push(targetStyles[i]);
        }
    }
    return [targetPaths_.reverse(), targetStyles_.reverse()];
}

export function transforming(
    text: Text,
    targetLayer: RenderNode,
    l: number,
    r: number,
    source: {
        styles: Array<PathStyle>;
        paths: Array<PathView>;
    },
    target: {
        styles: Array<PathStyle>;
        paths: Array<PathView>;
    }
) {
    console.log("transforming, l=", l, "r=", r);
    if (l === r) return;
    let sourcePaths = source.paths;
    let sourceStyles = source.styles;
    let targetPaths = target.paths;
    let targetStyles = target.styles;
    if (sourcePaths.length < targetPaths.length)
        [sourcePaths, sourceStyles] = sourcePrepare(sourcePaths, sourceStyles, targetPaths, targetStyles);
    else [targetPaths, targetStyles] = targetPrepare(sourcePaths, sourceStyles, targetPaths, targetStyles);

    console.log(sourcePaths, sourceStyles);
    console.log(targetPaths, targetStyles);

    const create = (path: RenderNode, source: any, target: any, interp: any, animatedKey: string) => {
        new Action(l, r, source, target, interp(path, animatedKey), T.easeInOut, path, animatedKey);
    };

    console.log("Create group onto target=", targetLayer);
    const group = RenderNode.createRenderNodeWithTime(targetLayer, l, l, "g");
    const transformingPath = [];

    for (const source of sourcePaths) {
        const path = RenderNode.createRenderNodeWithoutAction(undefined, group, "path");
        transformingPath.push(path);
    }
    for (let i = 0; i < transformingPath.length; i++) {
        const source_ = sourcePaths[i];
        const target_ = targetPaths[i];
        const sourceStyle = sourceStyles[i].styleAt(text, l);
        const targetStyle = targetStyles[i].styleAt(text, r);
        const path = transformingPath[i];
        console.log("sourceStyle=", sourceStyle);
        console.log("targetStyle=", targetStyle);
        console.log("source_=", source_);
        console.log("target_=", target_);
        if (source_.status !== "normal") {
            const so = +source_.status.slice(8, 9);
            const to = +source_.status.slice(11);
            create(path, so, to, Interp.numberInterp, "opacity");
        }
        if (target_) {
            const sd = source_.d;
            const td = target_.d;
            path.setAttribute("d", sd);
            create(path, sd, td, Interp.pathInterp, "d");
            // const sm = source_.transform;
            // const tm = target_.transform;
            // create(path, sm, tm, Interp.matrixInterp, "transform");
            const sf = sourceStyle.fill;
            const tf = targetStyle.fill;
            create(path, sf, tf, Interp.colorInterp, "fill");
            // const ss = sourceStyle.stroke;
            // const ts = targetStyle.stroke;
            // create(path, ss, ts, Interp.colorInterp, "stroke");
        }
    }
    group.__animate(r, r).remove();
}
