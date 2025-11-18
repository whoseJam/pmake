import { rand } from "@/Utility/Random";

export type SDRGBColor = {
    r: number;
    g: number;
    b: number;
};
export type SDHEXColor = string;
export type SDColor = SDRGBColor | SDHEXColor;
export type SDPacketColor = {
    fill: SDColor;
    stroke: SDColor;
};
export type SDAllColor = SDColor | SDPacketColor;

export class Color {
    // Basic colors
    static red = "#f14c4c";
    static blue = "#4a90e2";
    static cyan = "#00ffff";
    static grey = "#999999";
    static gray = "#999999";
    static pink = "#ff69b4";
    static snow = "#fffafa";
    static azure = "#f0ffff";
    static black = "#000000";
    static brown = "#8b4726";
    static coral = "#ff7256";
    static green = "#92d050";
    static white = "#ffffff";
    static orange = "#f58617";
    static purple = "#da70d6";
    static violet = "#ee82ee";
    static yellow = "#ffff4d";
    static indigo = "#4b0082";
    static lime = "#00ff00";
    static teal = "#008080";
    static navy = "#000080";
    static maroon = "#800000";
    static olive = "#808000";
    static silver = "#c0c0c0";
    static gold = "#ffd700";
    static beige = "#f5f5dc";
    static ivory = "#fffff0";
    static khaki = "#f0e68c";
    static lavender = "#e6e6fa";
    static magenta = "#ff00ff";
    static mint = "#98ff98";
    static peach = "#ffdab9";
    static plum = "#dda0dd";
    static salmon = "#fa8072";
    static tan = "#d2b48c";
    static turquoise = "#40e0d0";

    // Dark variants
    static darkRed = "#b13535";
    static darkBlue = "#89a4a7";
    static darkGrey = "#808080";
    static darkGray = "#808080";
    static darkPink = "#ff1493";
    static darkGreen = "#006400";
    static darkOrange = "#b4610e";
    static darkPurple = "#9932cc";
    static darkCyan = "#008b8b";
    static darkGoldenrod = "#b8860b";
    static darkKhaki = "#bdb76b";
    static darkMagenta = "#8b008b";
    static darkOlive = "#556b2f";
    static darkSalmon = "#e9967a";
    static darkSeaGreen = "#8fbc8f";
    static darkSlateBlue = "#483d8b";
    static darkSlateGrey = "#2f4f4f";
    static darkTurquoise = "#00ced1";
    static darkViolet = "#9400d3";

    // Pure colors
    static pureRed = "#ff0000";
    static pureBlue = "#0000ff";
    static pureGreen = "#00ff00";

    // Light variants
    static lightRed = "#ff6347";
    static lightBlue = "#add8e6";
    static lightCoral = "#f08080";
    static lightCyan = "#e0ffff";
    static lightGreen = "#90ee90";
    static lightGrey = "#d3d3d3";
    static lightPink = "#ffb6c1";
    static lightSalmon = "#ffa07a";
    static lightSeaGreen = "#20b2aa";
    static lightSkyBlue = "#87cefa";
    static lightYellow = "#ffffe0";

    // Special colors
    static textBlue = "#24b7ff";
    static aliceBlue = "#f0f8ff";
    static chocolate = "#d2691e";
    static paleGreen = "#98fb98";
    static peachPuff = "#ffdab9";
    static buttonGrey = "#f0f0f0";
    static ghostWhite = "#f8f8ff";
    static deepSkyBlue = "#00bfff";
    static lemonChiffon = "#fffacd";
    static darkButtonGrey = "#767676";
    static crimson = "#dc143c";
    static hotPink = "#ff69b4";
    static mediumPurple = "#9370db";
    static mediumSeaGreen = "#3cb371";
    static mediumSlateBlue = "#7b68ee";
    static mediumSpringGreen = "#00fa9a";
    static mediumTurquoise = "#48d1cc";
    static mediumVioletRed = "#c71585";
    static midnightBlue = "#191970";
    static mistyRose = "#ffe4e1";
    static orchid = "#da70d6";
    static paleVioletRed = "#db7093";
    static powderBlue = "#b0e0e6";
    static rosyBrown = "#bc8f8f";
    static royalBlue = "#4169e1";
    static sandyBrown = "#f4a460";
    static seaGreen = "#2e8b57";
    static skyBlue = "#87ceeb";
    static slateBlue = "#6a5acd";
    static slateGrey = "#708090";
    static springGreen = "#00ff7f";
    static steelBlue = "#4682b4";
    static tomato = "#ff6347";
    static wheat = "#f5deb3";
    static yellowGreen = "#9acd32";

    static RED = { fill: this.red, stroke: this.darkRed };
    static BLUE = { fill: this.blue, stroke: this.darkBlue };
    static GREY = { fill: this.grey, stroke: this.darkGrey };
    static GRAY = { fill: this.gray, stroke: this.darkGray };
    static GREEN = { fill: this.green, stroke: this.darkGreen };
    static ORANGE = { fill: this.orange, stroke: this.darkOrange };
    static PURPLE = { fill: this.purple, stroke: this.darkPurple };
    static YELLOW = { fill: this.yellow, stroke: this.gold };
    static CYAN = { fill: this.cyan, stroke: this.darkCyan };
    static PINK = { fill: this.pink, stroke: this.darkPink };
    static DEFAULT = { fill: this.white, stroke: this.black };
    static BUTTON_GREY = { fill: this.buttonGrey, stroke: this.darkButtonGrey };

    static random(): string {
        const hexCharacters = "0123456789abcdef";
        const randHex = () => hexCharacters[rand(0, hexCharacters.length - 1)];
        return "#" + Array.from({ length: 6 }, randHex).join("");
    }

    static equal(a: SDAllColor, b: SDAllColor): boolean {
        if (this.isPacket(a) && this.isPacket(b)) return this.equal(a.fill, b.fill) && this.equal(a.stroke, b.stroke);
        if (this.isPacket(a) || this.isPacket(b)) return false;
        const hexA = this.toHEX(a);
        const hexB = this.toHEX(b);
        return hexA.toLowerCase() === hexB.toLowerCase();
    }

    static gradient(start: string, end: string, l: number, r: number): (at: number) => SDRGBColor {
        const startRgb = this.toRGB(start);
        const endRgb = this.toRGB(end);
        return (at: number) => {
            const k = (at - l) / (r - l);
            const color = {
                r: startRgb.r + (endRgb.r - startRgb.r) * k,
                g: startRgb.g + (endRgb.g - startRgb.g) * k,
                b: startRgb.b + (endRgb.b - startRgb.b) * k,
            };
            return color;
        };
    }

    static doubleGradient(
        start: string,
        mid: string,
        end: string,
        l: number,
        m: number,
        r: number
    ): (at: number) => SDRGBColor {
        const g1 = this.gradient(start, mid, l, m);
        const g2 = this.gradient(mid, end, m, r);
        return (at: number) => (at <= m ? g1(at) : g2(at));
    }

    static isRGB(color: SDAllColor): color is SDRGBColor {
        return typeof color === "object" && "r" in color && "g" in color && "b" in color;
    }

    static isHEX(color: SDAllColor): color is SDHEXColor {
        return typeof color === "string";
    }

    static isPacket(color: SDAllColor): color is SDPacketColor {
        return typeof color === "object" && "fill" in color && "stroke" in color;
    }

    static isColor(color: any): color is SDAllColor {
        return this.isRGB(color) || this.isHEX(color) || this.isPacket(color);
    }

    static toRGB(color: SDColor): SDRGBColor {
        if (typeof color === "string") return hexToRgb(color);
        return color;
    }

    static toHEX(color: SDColor): SDHEXColor {
        if (typeof color === "string") return color;
        return rgbToHex(color);
    }

    static toFill(color: SDAllColor): SDColor {
        if (this.isPacket(color)) return color.fill;
        return color;
    }

    static toStroke(color: SDAllColor): SDColor {
        if (this.isPacket(color)) return color.stroke;
        return color;
    }

    static toString(color: SDColor): string {
        const rgb = this.toRGB(color);
        if (rgb) return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        return undefined;
    }
}

export function color() {
    return Color;
}

function hexToNumber(str: string): number {
    return parseInt(str, 16);
}

function numberToHex(number: number): string {
    return Math.floor(number).toString(16).padStart(2, "0");
}

function hexToRgb(hex: string): SDRGBColor {
    const color = hex.replace("#", "");
    return {
        r: hexToNumber(color.slice(0, 2)),
        g: hexToNumber(color.slice(2, 4)),
        b: hexToNumber(color.slice(4, 6)),
    };
}

function rgbToHex(color: SDRGBColor): string {
    return "#" + numberToHex(color.r) + numberToHex(color.g) + numberToHex(color.b);
}
