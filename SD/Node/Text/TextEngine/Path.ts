import { Animate as A } from "@/Animate/Animate";
import { Text } from "@/Node/Text/Text";
import { TextEngine } from "../TextEngine";
import { PathView } from "./TextView";

export function getTextPaths(text: Text, t: number) {
    const text_ = A.getAttribute(text, "text", t, text.getText());
    const family = A.getAttribute(text, "font-family", t, text.getFontFamily());
    const size = A.getAttribute(text, "font-size", t, text.getFontSize());
    const x = A.getAttribute(text, "x", t, text.getX());
    const y = A.getAttribute(text, "y", t, text.getY());
    const paths = TextEngine.getTextPathsFromOpenType(text_, family, size, x, y);
    const paths_ = [];
    for (let i = 0; i < paths.length; i++) {
        const d = paths[i].toPathData(4);
        paths_.push(new PathView(d));
    }
    return paths_;
}
