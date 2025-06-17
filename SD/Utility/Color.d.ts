export class SDColor {
    fill: string;
    stroke: string;
}

export class Color {
    static red: string;
    static blue: string;
    static cyan: string;
    static grey: string;
    static pink: string;

    /**
     * 雪白色
     */
    static snow: string;

    static azure: string;
    static black: string;

    /**
     * 珊瑚红
     */
    static coral: string;

    static green: string;
    static white: string;
    static orange: string;
    static purple: string;

    /**
     * 紫罗兰色
     */
    static violet: string;

    static yellow: string;
    static darkRed: string;
    static pureRed: string;
    static darkBlue: string;
    static darkGrey: string;
    static darkPink: string;
    static pureBlue: string;

    /**
     * 文本蓝
     */
    static textBlue: string;

    static aliceBlue: string;
    static chocolate: string;
    static darkGreen: string;
    static paleGreen: string;

    /**
     * 粉红桃色
     */
    static peachPuff: string;
    static pureGreen: string;
    static buttonGrey: string;
    static darkOrange: string;
    static darkPurple: string;

    /**
     * 幽灵白
     */
    static ghostWhite: string;

    /**
     * 天空蓝
     */
    static deepSkyBlue: string;

    /**
     * 柠檬绸色
     */
    static lemonChiffon: string;
    static darkButtonGrey: string;

    static RED: SDColor;
    static BLUE: SDColor;
    static GREY: SDColor;
    static GREEN: SDColor;
    static ORANGE: SDColor;
    static PURPLE: SDColor;
    static DEFAULT: SDColor;
    static BUTTON_GREY: SDColor;

    static random: () => string;
    static equal(a: SDColor, b: SDColor): boolean;
    static gradient: (start: string, end: string, l: number, r: number) => (grad: number) => string;
    static doubleGradient: (start: string, mid: string, end: string, l: number, m: number, r: number) => (grad: number) => string;
}

/**
 * Returns the **`Color`** module for color operations.
 * @returns The Color module.
 *
 * @example
 * const C = sd.color();
 * element.color(C.red);
 * element.color(C.random());
 */
export function color(): typeof Color;
