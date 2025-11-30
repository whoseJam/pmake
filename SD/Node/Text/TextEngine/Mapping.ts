import { TextMappingLocation } from "@/Node/Text/BaseText";
import { SubtextView, TextView } from "@/Node/Text/TextEngine/TextView";
import { make1d } from "@/Utility/Base";

function calculate(textView: TextView, deleted: Array<boolean>, pattern: TextMappingLocation) {
    if (typeof pattern === "string") {
        for (let i = 0; i < textView.hash.length; i++) {
            let matched = true;
            for (let j = 0; j < pattern.length && matched; j++) {
                if (pattern[j] !== textView.hash[i + j] || deleted[j]) matched = false;
            }
            if (matched) {
                // for (let j  = 0; j < pattern.length; j ++) {

                return new SubtextView(textView, i, i + pattern.length - 1);
            }
        }
    }
}

export function matchSubtext(textView: TextView, pattern: string) {
    for (let i = 0; i < textView.hash.length; i++) {
        let matched = true;
        for (let j = 0; j < pattern.length && matched; j++) {
            if (pattern[j] !== textView.hash[i + j]) matched = false;
        }
        console.log(
            "i=",
            i,
            "matched=",
            matched,
            "pattern=",
            pattern,
            "slice=",
            textView.text.slice(i, i + pattern.length)
        );
        if (matched) {
            return new SubtextView(textView, i, i + pattern.length - 1);
        }
    }
}

export function match(sourceView: TextView, targetView: TextView, mappings: any): Array<[SubtextView, SubtextView]> {
    const matchings = [];
    const sourceDeleted = make1d(sourceView.hash.length, false);
    const targetDeleted = make1d(targetView.hash.length, false);
    for (const mapping of mappings) {
        const source = mapping.source;
        const target = mapping.target;
        const sourceSubtextView = calculate(sourceView, sourceDeleted, source);
        const targetSubtextView = calculate(targetView, targetDeleted, target);
        sourceSubtextView.validateStyle();
        targetSubtextView.setStyle(sourceSubtextView.getStyle());
        matchings.push(sourceSubtextView, targetSubtextView);
    }
    const sourceSet = new Set<number>();
    const targetSet = new Set<number>();
    sourceDeleted.forEach((value, i) => {
        if (!value) sourceSet.add(i);
    });
    targetDeleted.forEach((value, i) => {
        if (!value) targetSet.add(i);
    });
    const sourceSubtextView = new SubtextView(sourceView, sourceSet);
    const targetSubtextView = new SubtextView(targetView, targetSet);
    sourceSubtextView.validateStyle();
    targetSubtextView.setStyle(sourceSubtextView.getStyle());
    matchings.push([sourceSubtextView, targetSubtextView]);
    return matchings;
}
