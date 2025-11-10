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
