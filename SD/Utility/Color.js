import { randHexColor } from "@/Utility/Random";

export class Color {
    static red = "#f14c4c"
    static blue = "#bbe0e3"
    static cyan = "#00FFFF"
    static grey = "#cccccc"
    static snow = "#fffafa"
    static azure = "#F0FFFF"
    static black = "#000000"
    static coral = "#FF7256"
    static green = "#92d050"
    static white = "#ffffff"
    static orange = "#f58617"
    static purple = "#800080"
    static violet = "#ee82ee"
    static yellow = "#ffff4d"
    static textBlue = "#24b7ff"
    static aliceBlue = "#F0F8FF"
    static paleGreen = "#98FB98"
    static peachPuff = "#FFDAB9"
    static ghostWhite = "#F8F8FF"
    static deepSkyBlue = "#00bfff"
    static lemonChiffon = "#FFFACD"

    static RED = { main: "#f14c4c", border: "#b13535" }
    static BLUE = { main: "#bbe0e3", border: "#89a4a7" }
    static GREY = { main: "#cccccc", border: "#808080" }
    static GREEN = { main: "#92d050", border: "#00b050" }
    static ORANGE = { main: "#f58617", border: "#b4610e" }
    static PURPLE = { main: "#800080", border: "#5c0a5c" }
    static DEFAULT = { main: "#ffffff", border: "#000000" }

    static rand = randHexColor

    static gradient(source, target, l, r) {
        source = HexToRGB(source);
        target = HexToRGB(target);
        return function(at) {
            const k = (at - l) / (r - l);
            const color = {
                r: source.r + (target.r - source.r) * k,
                g: source.g + (target.g - source.g) * k,
                b: source.b + (target.b - source.b) * k
            };
            return RGBToHex(color);
        }
    }
}

export function color() {
    return Color;
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