import { Animate as A } from "@/Animate/Animate";
import { Text } from "@/Node/Text/Text";
import { PathView } from "@/Node/Text/TextEngine/TextView";
import { FontManager } from "@/Node/Text/TextEngine/Opentype";

export function getTextPaths(text: Text, t: number): Array<PathView> {
    const text_ = A.getAttribute(text, "text", t, text.getText());
    const family = A.getAttribute(text, "fontFamily", t, text.getFontFamily());
    const size = A.getAttribute(text, "fontSize", t, text.getFontSize());
    const x = A.getAttribute(text, "x", t, text.getX());
    const y = A.getAttribute(text, "y", t, text.getY());
    const paths = FontManager.getTextPathsFromOpenType(text_, family, size, x, y);
    return paths.map(path => {
        const data = path.toPathData(4);
        if (data === "") return undefined;
        return new PathView(data);
    });
}

export function getTextPaths2(text: Text, t: number, string: string): Array<PathView> {
    const family = A.getAttribute(text, "fontFamily", t, text.getFontFamily());
    const size = A.getAttribute(text, "fontSize", t, text.getFontSize());
    const x = A.getAttribute(text, "x", t, text.getX());
    const y = A.getAttribute(text, "y", t, text.getY());
    const paths = FontManager.getTextPathsFromOpenType(string, family, size, x, y);
    return paths.map(path => {
        const data = path.toPathData(4);
        if (data === "") return undefined;
        return new PathView(data);
    });
}
