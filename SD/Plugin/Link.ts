import { LinkPluginMixin } from "@/Node/Mixin/LinkPluginMixin";
import { SDNode } from "@/Node/SDNode";

type XLocation = "x" | "cx" | "mx";
type YLocation = "y" | "cy" | "my";

type LinkPlugin<T> = T & InstanceType<ReturnType<typeof LinkPluginMixin>>;

/**
 * Creates a **`sd.LinkPlugin`** instance.
 * @param source - The source node to link from.
 * @param target - The target node to link to.
 * @param clazz - The class to instantiate for the link (defaults to Line).
 * @param sx - The x coordinate property of the source location (defaults to "cx").
 * @param sy - The y coordinate property of the source location (defaults to "cy").
 * @param tx - The x coordinate property of the target location (defaults to "cx").
 * @param ty - The y coordinate property of the target location (defaults to "cy").
 * @returns A new LinkPlugin<T> instance that extends T.
 */
export function Link<T>(
    source: SDNode,
    target: SDNode,
    clazz: new (...args: any[]) => SDNode,
    sx: XLocation = "cx",
    sy: YLocation = "cy",
    tx: XLocation = "cx",
    ty: YLocation = "cy"
): LinkPlugin<T> {
    const LinkPluginClass = LinkPluginMixin(clazz);
    return new LinkPluginClass(target)
        .sourceElement(source)
        .targetElement(target)
        .sourceLocationX(sx)
        .sourceLocationY(sy)
        .targetLocationX(tx)
        .targetLocationY(ty)
        .__postConstruct() as LinkPlugin<T>;
}
