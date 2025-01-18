export type HexColor = string;
export type PacketColor = { main: HexColor; border: HexColor };
export type SDColor = HexColor | PacketColor;

export class Color {
    static red: HexColor;
    static blue: HexColor;
    static cyan: HexColor;
    static grey: HexColor;
    static pink: HexColor;

    /**
     * 雪白色
     */
    static snow: HexColor;

    static azure: HexColor;
    static black: HexColor;

    /**
     * 珊瑚红
     */
    static coral: HexColor;

    static green: HexColor;
    static white: HexColor;
    static orange: HexColor;
    static purple: HexColor;

    /**
     * 紫罗兰色
     */
    static violet: HexColor;

    static yellow: HexColor;
    static darkRed: HexColor;
    static pureRed: HexColor;
    static darkBlue: HexColor;
    static darkGrey: HexColor;
    static darkPink: HexColor;
    static pureBlue: HexColor;

    /**
     * 文本蓝
     */
    static textBlue: HexColor;

    static aliceBlue: HexColor;
    static chocolate: HexColor;
    static darkGreen: HexColor;
    static paleGreen: HexColor;

    /**
     * 粉红桃色
     */
    static peachPuff: HexColor;
    static pureGreen: HexColor;

    static darkOrange: HexColor;
    static darkPurple: HexColor;

    /**
     * 幽灵白
     */
    static ghostWhite: HexColor;

    /**
     * 天空蓝
     */
    static deepSkyBlue: HexColor;

    /**
     * 柠檬绸色
     */
    static lemonChiffon: HexColor;

    static RED: PacketColor;
    static BLUE: PacketColor;
    static GREY: PacketColor;
    static GREEN: PacketColor;
    static ORANGE: PacketColor;
    static PURPLE: PacketColor;
    static DEFAULT: PacketColor;

    /**
     * 获取一种随机的颜色
     * @returns
     */
    static rand: () => HexColor;

    /**
     * 获取梯度颜色生成器
     * @param start 起始颜色
     * @param end 终止颜色
     * @param l 左端点
     * @param r 右端点
     * @returns 梯度颜色生成器
     */
    static gradient: (start: HexColor, end: HexColor, l: number, r: number) => (grad: number) => HexColor;
}

export function color(): typeof Color;
