import { rand } from "./Random";

let _chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
const _rand_char = () => {
    return _chars[rand(0, _chars.length - 1)];
}

export const Color = {
    black:  "#000000",
    green:  "#92d050",
    white:  "#ffffff",
    grey:   "#cccccc",
    blue:   "#bbe0e3",
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
    }
}

export function color() {
    return Color;
}
