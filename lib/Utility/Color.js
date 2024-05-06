// @ts-check
import { rand } from "./Random";

/**
 * @typedef {Object} SDPackedColor
 * @property {string} border
 * @property {string} main
 * @typedef {string} SDUnpackedColor
 * @typedef {SDPackedColor|SDUnpackedColor} SDColor
 */

const _chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
const _rand_char = () => {
    return _chars[rand(0, _chars.length - 1)];
}

function hex2number(str) {
    const v0 = str.charCodeAt(0);
    const v1 = str.charCodeAt(1);
    function getNumber(v) {
        if (65 <= v && v <= 90) return v - 65 + 10;
        if (97 <= v && v <= 122) return v - 97 + 10;
        return v - 48;
    }
    return getNumber(v0) * 16 + getNumber(v1);
}

function number2hex(number) {
    let ans = "";
    number = Math.floor(number);
    while (number > 0) {
        let v = number % 16;
        if (0 <= v && v <= 9) ans = v + ans;
        else ans = (String.fromCharCode(v + 97 - 10)) + ans; 
        number >>= 4;
    }
    if (ans.length === 0) ans = "00";
    else if (ans.length === 1) ans = "0" + ans; 
    return ans;
}

function hex2rgb(str) {
    return {
        r: hex2number(str.slice(1, 3)),
        g: hex2number(str.slice(3, 5)),
        b: hex2number(str.slice(5, 7))
    };
}

function rgb2hex(color) {
    return "#" + number2hex(color.r) + number2hex(color.g) + number2hex(color.b);
}

export const Color = {
    /** @type {SDUnpackedColor} */
    black:  "#000000",
    /** @type {SDUnpackedColor} */
    green:  "#92d050",
    /** @type {SDUnpackedColor} */
    white:  "#ffffff",
    /** @type {SDUnpackedColor} */
    grey:   "#cccccc",
    /** @type {SDUnpackedColor} */
    blue:   "#bbe0e3",
    /** @type {SDUnpackedColor} */
    textBlue: "#24b7ff",
    /** @type {SDUnpackedColor} */
    red:    "#f14c4c",
    /** @type {SDUnpackedColor} */
    orange: "#f58617",
    /** @type {SDUnpackedColor} */
    purple: "#800080",

    /** @type {SDPackedColor} */
    RED:    { main: "#f14c4c", border: "#b13535" },
    /** @type {SDPackedColor} */
    GREEN:  { main: "#92d050", border: "#00b050" },
    /** @type {SDPackedColor} */
    GREY:   { main: "#cccccc", border: "#808080" },
    /** @type {SDPackedColor} */
    BLUE:   { main: "#bbe0e3", border: "#89a4a7" },
    /** @type {SDPackedColor} */
    ORANGE: { main: "#f58617", border: "#b4610e" },
    /** @type {SDPackedColor} */
    PURPLE: { main: "#800080", border: "#5c0a5c" },
    /** @type {SDPackedColor} */
    DEFAULT:{ main: "#ffffff", border: "#000000" },

    /**
     * 随机生成一种颜色
     * @returns {SDUnpackedColor}
     */
    rand: () => {
        return "#" + 
            _rand_char() + _rand_char() + 
            _rand_char() + _rand_char() + 
            _rand_char() + _rand_char();
    },
    gradient: gradient
}

export function color() {
    return Color;
}

function gradient(from, to, l, r) {
    from = hex2rgb(from); to = hex2rgb(to);
    return function(at) {
        let k = (at - l) / (r - l);
        let color = {
            r: from.r + (to.r - from.r) * k,
            g: from.g + (to.g - from.g) * k,
            b: from.b + (to.b - from.b) * k
        };
        return rgb2hex(color);
    }
}
