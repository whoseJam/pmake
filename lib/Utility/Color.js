import { rand } from "./Random";

let _chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
const _rand_char = () => {
    return _chars[rand(0, _chars.length - 1)];
}

function hex2number(str) {
    let v0 = str.charCodeAt(0);
    let v1 = str.charCodeAt(1);
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
        else ans = (String.fromCharCode([v + 97 - 10])) + ans; 
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
    black:  "#000000",
    green:  "#92d050",
    white:  "#ffffff",
    grey:   "#cccccc",
    blue:   "#bbe0e3",
    textBlue: "#24b7ff",
    red:    "#f14c4c",
    orange: "#f58617",
    purple: "#800080",

    RED:    { main: "#f14c4c", border: "#b13535" },
    GREEN:  { main: "#92d050", border: "#00b050" },
    GREY:   { main: "#cccccc", border: "#808080" },
    BLUE:   { main: "#bbe0e3", border: "#89a4a7" },
    ORANGE: { main: "#f58617", border: "#b4610e" },
    PURPLE: { main: "#800080", border: "#5c0a5c" },
    DEFAULT:{ main: "#ffffff", border: "#000000" },
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
