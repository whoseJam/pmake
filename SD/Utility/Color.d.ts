
export type HexColor = string;
export type PacketColor = { main: HexColor, border: HexColor };
export type Color = HexColor | PacketColor;

interface ColorManager {
    /**
     * 黑色
     */
    black:        HexColor,
    
    /**
     * 绿色
     */
    green:        HexColor,

    /**
     * 白色
     */
    white:        HexColor,

    /**
     * 灰色
     */
    grey:         HexColor,

    /**
     * 蓝色
     */
    blue:         HexColor,

    /**
     * 天空蓝
     */
    deepSkyBlue:  HexColor,

    /**
     * 文本蓝
     */
    textBlue:     HexColor,

    /**
     * 红色
     */
    red:          HexColor,

    /**
     * 珊瑚红
     */
    coral:        HexColor,

    /**
     * 橙色
     */
    orange:       HexColor,

    /**
     * 紫色
     */
    purple:       HexColor,

    /**
     * 紫罗兰色
     */
    violet:       HexColor,

    /**
     * 雪白色
     */
    snow:         HexColor,

    /**
     * 幽灵白
     */
    ghostWhite:   HexColor,

    /**
     * 粉红桃色
     */
    peachPuff:    HexColor,

    /**
     * 柠檬绸色
     */
    lemonChiffon: HexColor,

    yellow:       HexColor,
    azure:        HexColor,
    aliceBlue:    HexColor,
    cyan:         HexColor,
    paleGreen:    HexColor,

    RED:     PacketColor,
    GREEN:   PacketColor,
    GREY:    PacketColor,
    BLUE:    PacketColor,
    ORANGE:  PacketColor,
    PURPLE:  PacketColor,
    DEFAULT: PacketColor,

    /**
     * 获取一种随机的颜色
     * @returns 
     */
    rand: () => HexColor,
    
    /**
     * 获取梯度颜色生成器
     * @param start 起始颜色
     * @param end 终止颜色
     * @param l 左端点
     * @param r 右端点
     * @returns 梯度颜色生成器
     */
    gradient: (start: HexColor, end: HexColor, l: number, r: number) => (grad: number) => HexColor, 
}

export function color(): ColorManager;