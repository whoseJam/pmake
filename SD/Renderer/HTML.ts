export const HTML_INNERHTML_SET = new Set(["innerHTML", "text"]);

export const HTML_STYLE_SET = new Set([
    // style key
    "pointer-events",
    "position",
    "width",
    "height",
    "min-width",
    "min-height",
    "display",
    "opacity",
]);

const STYLE_KEY_MAP = {
    "pointer-events": true,
    "position": true,
    "width": { svg: false, html: true },
    "height": { svg: false, html: true },
    "min-width": true,
    "min-height": true,
    "display": true,
    "opacity": { svg: false, html: true },
    "border-radius": true,
};

export function isStyleKey(type: "svg" | "html", key: string) {
    const style = STYLE_KEY_MAP[key];
    if (style) {
        if (typeof style === "object") return style[type];
        return true;
    }
    return false;
}

export const HTML = {
    div: {
        hasShape: false,
    },
    input: {
        hasShape: true,
    },
    button: {
        hasShape: true,
    },
    textarea: {
        hasShape: true,
    },
};
