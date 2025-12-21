import { Color as C } from "@/Utility/Color";

type Context = Record<string, any>;

const STYLE_KEY_MAP = {
    "pointer-events": true,
    "position": true,
    "min-width": true,
    "min-height": true,
    "display": true,
    "justify-content": true,
    "align-items": true,
    "border-radius": true,
    "width": { svg: false, html: true },
    "height": { svg: false, html: true },
    "opacity": { svg: false, html: true },
};

export function isStyleKey(type: "svg" | "html", key: string) {
    const style = STYLE_KEY_MAP[key];
    if (style) {
        if (typeof style === "object") return style[type];
        return true;
    }
    return false;
}

class AttributeConverter {
    aliasKey: string;
    default: string;
    toString: (object: any, context?: Context) => string;
    constructor(aliasKey: string, default_: string, toString: (object: any, context?: Context) => string) {
        this.aliasKey = aliasKey;
        this.default = default_;
        this.toString = toString;
    }
}

const ATTRIBUTE_KEY_MAP: Record<string, AttributeConverter> = {
    fill: new AttributeConverter("fill", C.white, color => C.toString(color)),
    stroke: new AttributeConverter("stroke", C.black, color => C.toString(color)),
    scale: new AttributeConverter("transform", undefined, (value: [number, number], context: Context) => {
        context.scale = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    rotate: new AttributeConverter("transform", undefined, (value: any, context: Context) => {
        context.rotate = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    translate: new AttributeConverter("transform", undefined, (value: [number, number], context: Context) => {
        context.translate = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    transformOrigin: new AttributeConverter(
        "transform-origin",
        undefined,
        (value: [number, number]) => `${value[0]} ${value[1]}`
    ),
    strokeDashArray: new AttributeConverter("stroke-dasharray", undefined, (value: Array<number>) => {
        let dashed = 0;
        for (let i = 1; i < value.length; i += 2) dashed += value[i];
        if (dashed > 0) return value.join(" ");
        return undefined;
    }),
    strokeDashOffset: new AttributeConverter("stroke-dashoffset", undefined, (value: number) => `${value}`),
};

export function setAttribute(element: Element, key: string, value: any) {
    const attribute = ATTRIBUTE_KEY_MAP[key];
    if (!attribute) {
        element.setAttribute(key, value);
        return;
    }
    const element_ = element as Element & { __setAttributeContext: Record<string, any> };
    if (element_.__setAttributeContext === undefined) element_.__setAttributeContext = {};
    const value_ = attribute.toString(value, element_.__setAttributeContext);
    const key_ = attribute.aliasKey;
    if (value_ !== undefined) element.setAttribute(key_, value_);
    else if (attribute.default) element.setAttribute(key_, attribute.default);
    else element.removeAttribute(key_);
}
