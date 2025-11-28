import { SDNode, SDNodeWithRadius } from "@/Node/SDNode";

interface CenterContentFitLayoutParam {
    rate?: number;
}

/**
 * Layout function for centering a child node within a parent node.
 *
 * This function positions the child node at the exact center of the parent node.
 *
 * @param parent - The reference node
 * @param child - The node to be centered
 *
 * @example
 * // Center a child node within parent
 * CenterLayout(parentNode, childNode);
 */
export function CenterLayout(parent: SDNode, child: SDNode) {
    child.center(parent.center());
}

/**
 * Layout function for centering and fitting a child node within a parent node.
 *
 * This function automatically detects whether the parent is a circle (has radius)
 * or a rectangle, and applies the appropriate content-fit algorithm.
 *
 * @param parent - The reference node
 * @param child - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller child)
 *
 * @example
 * // Center and fit child within parent
 * CenterContentFitLayout(parentNode, childNode, { rate: 1.5 });
 *
 * @example
 * // Use default rate
 * CenterContentFitLayout(parentNode, childNode);
 */
export function CenterContentFitLayout(parent: SDNode, child: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args || {};

    const circle = parent as SDNodeWithRadius;
    if (typeof circle.r === "function") {
        CenterCircleContentFitLayout(parent, child, { rate });
    } else {
        CenterRectContentFitLayout(parent, child, { rate });
    }
}

/**
 * Layout function for centering and fitting a child node within a rectangular parent.
 *
 * This function scales the child to fit within the parent's bounds while maintaining
 * the child's aspect ratio, then centers it.
 *
 * @param parent - The rectangular parent node
 * @param child - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller child)
 *
 * Algorithm:
 * 1. Calculate the scaling factor to fit child within parent bounds
 * 2. Apply the rate to make child smaller/larger
 * 3. Scale child dimensions
 * 4. Center child within parent
 *
 * @example
 * // Fit child within rectangular parent
 * CenterRectContentFitLayout(rectNode, childNode, { rate: 1.2 });
 *
 * @example
 * // Use default rate
 * CenterRectContentFitLayout(rectNode, childNode);
 */
export function CenterRectContentFitLayout(parent: SDNode, child: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args || {};

    const center = parent.center();
    const [w, h] = [parent.width(), parent.height()];
    const cw = Math.max(child.width(), 1);
    const ch = Math.max(child.height(), 1);
    const k = Math.min(w / cw, h / ch) / rate;

    child
        .width(cw * k)
        .height(ch * k)
        .center(center);
}

/**
 * Layout function for centering and fitting a child node within a circular parent.
 *
 * This function scales the child to fit within the parent circle's inscribed rectangle
 * while maintaining the child's aspect ratio, then centers it.
 *
 * @param parent - The circular parent node
 * @param child - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller child)
 *
 * Algorithm:
 * 1. Calculate the maximum rectangle that fits in the circle
 * 2. Scale based on child's aspect ratio
 * 3. Apply the rate factor
 * 4. Center child within parent
 *
 * @example
 * // Fit child within circular parent
 * CenterCircleContentFitLayout(circleNode, childNode, { rate: 1.2 });
 *
 * @example
 * // Use default rate
 * CenterCircleContentFitLayout(circleNode, childNode);
 */
export function CenterCircleContentFitLayout(parent: SDNode, child: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args || {};

    const center = parent.center();
    const r = Math.min(parent.width(), parent.height()) / 2 / rate;
    const cw = Math.max(child.width(), 1);
    const ch = Math.max(child.height(), 1);
    const k = ch / cw;
    const w = 2 * Math.sqrt((r * r) / (k * k + 1));
    const h = w * k;

    child.width(w).height(h).center(center);
}

/**
 * Layout function for centering and fitting a child node within an elliptical parent.
 *
 * This function scales the child to fit within the parent ellipse while maintaining
 * the child's aspect ratio, then centers it.
 *
 * @param parent - The elliptical parent node
 * @param child - The node to be centered and fitted
 * @param args - Layout parameters
 * @param args.rate - Scale factor for fitting (default: 1.2, larger = smaller child)
 *
 * Algorithm:
 * 1. Calculate ellipse semi-axes
 * 2. Find optimal scaling factor considering ellipse geometry
 * 3. Apply the rate factor
 * 4. Center child within parent
 *
 * @example
 * // Fit child within elliptical parent
 * CenterEllipseContentFitLayout(ellipseNode, childNode, { rate: 1.2 });
 *
 * @example
 * // Use default rate
 * CenterEllipseContentFitLayout(ellipseNode, childNode);
 */
export function CenterEllipseContentFitLayout(parent: SDNode, child: SDNode, args?: CenterContentFitLayoutParam) {
    const { rate = 1.2 } = args || {};

    const center = parent.center();
    const [w, h] = [parent.width() / 2 / rate, parent.height() / 2 / rate];
    const cw = Math.max(child.width(), 1);
    const ch = Math.max(child.height(), 1);
    const k = Math.min((2 * w) / cw, (2 * h) / ch, (2 * Math.sqrt(w * h)) / Math.sqrt(cw * ch));

    child
        .width(cw * k)
        .height(ch * k)
        .center(center);
}
