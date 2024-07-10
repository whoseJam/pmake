
type InterpCallback = (t: number) => void;
type InterpConstructor = (owner: any, prop: any) => InterpCallback;

interface InterpManager {
    /**
     * 对数字进行插值
     */
    numberInterp: InterpConstructor;

    /**
     * 对RGB颜色进行插值
     */
    colorInterp: InterpConstructor;

    /**
     * 对字符串进行插值
     */
    stringInterp: InterpConstructor;

    /**
     * 对innerHTML进行插值
     */
    innerHTMLInterp: InterpConstructor;

    /**
     * 对数组进行插值
     */
    arrayInterp: InterpConstructor;

    /**
     * 对matrix(a, b, c, d, e, f)进行插值
     */
    matrixInterp: InterpConstructor;

    /**
     * 对viewBox进行插值
     */
    viewBoxInterp: InterpConstructor;
}

export const Interp: InterpManager;