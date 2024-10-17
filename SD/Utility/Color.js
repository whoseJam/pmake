import { randHexColor } from "@/Utility/Random";

export const Color = {
    black:          "#000000",
    green:          "#92d050",
    white:          "#ffffff",
    grey:           "#cccccc",
    blue:           "#bbe0e3",
    deepSkyBlue:    "#00BFFF",
    textBlue:       "#24b7ff",
    red:            "#f14c4c",
    coral:          "#FF7256",
    orange:         "#f58617",
    purple:         "#800080",
    violet:         "#EE82EE",
    snow:           "#FFFAFA",
    ghostWhite:     "#F8F8FF",
    peachPuff:      "#FFDAB9",
    lemonChiffon:   "#FFFACD",
    azure:          "#F0FFFF",
    aliceBlue:      "#F0F8FF",
    cyan:           "#00FFFF",
    paleGreen:      "#98FB98",
    yellow:         "#ffff4d",

    RED:    { main: "#f14c4c", border: "#b13535" },
    GREEN:  { main: "#92d050", border: "#00b050" },
    GREY:   { main: "#cccccc", border: "#808080" },
    BLUE:   { main: "#bbe0e3", border: "#89a4a7" },
    ORANGE: { main: "#f58617", border: "#b4610e" },
    PURPLE: { main: "#800080", border: "#5c0a5c" },
    DEFAULT:{ main: "#ffffff", border: "#000000" },

    rand: randHexColor,
    gradient: gradient
}

export function color() {
    return Color;
}

function gradient(from, to, l, r) {
    from = HexToRGB(from); to = HexToRGB(to);
    return function(at) {
        const k = (at - l) / (r - l);
        const color = {
            r: from.r + (to.r - from.r) * k,
            g: from.g + (to.g - from.g) * k,
            b: from.b + (to.b - from.b) * k
        };
        return RGBToHex(color);
    }
}

function HexToNumber(str) {
    const v0 = str.charCodeAt(0);
    const v1 = str.charCodeAt(1);
    function GetNumber(v) {
        if (65 <= v && v <= 90) return v - 65 + 10;
        if (97 <= v && v <= 122) return v - 97 + 10;
        return v - 48;
    }
    return GetNumber(v0) * 16 + GetNumber(v1);
}

function NumberToHex(number) {
    let ans = "";
    number = Math.floor(number);
    while (number > 0) {
        const v = number % 16;
        if (0 <= v && v <= 9) ans = v + ans;
        else ans = (String.fromCharCode(v + 97 - 10)) + ans; 
        number >>= 4;
    }
    if (ans.length === 0) ans = "00";
    else if (ans.length === 1) ans = "0" + ans; 
    return ans;
}

function HexToRGB(str) {
    return {
        r: HexToNumber(str.slice(1, 3)),
        g: HexToNumber(str.slice(3, 5)),
        b: HexToNumber(str.slice(5, 7))
    };
}

function RGBToHex(color) {
    return "#" + NumberToHex(color.r) + NumberToHex(color.g) + NumberToHex(color.b);
}