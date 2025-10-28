import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDHTMLNode } from "@/Node/SDHTMLNode";

export class Caption extends SDHTMLNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        const container = this.__createHTMLNode("div", 800, 80);
        container.__injectCSS({});
        const cn = RenderNode.createRenderNode(this, container, "div");
        const en = RenderNode.createRenderNode(this, container, "div");
        this._.cn = cn;
        this._.en = en;

        container.__injectCSS({
            backgroundColor: "rgba(33, 37, 41, 0.7)",
            borderRadius: "12px",
            color: "white",
            textAlign: "center",
            opacity: "1",
            transition: "opacity 0.5s ease-in-out",
            zIndex: "100",
            backdropFilter: "blur(5px)",
        });
        cn.__injectCSS({
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "1.5",
        });
        en.__injectCSS({
            fontSize: "18px",
            fontWeight: "400",
            opacity: "0.8",
            lineHeight: "1.5",
        });

        this.type("Caption");
    }
    caption(cn: string, en: string) {
        this._.cn.setAttribute("text", cn);
        this._.en.setAttribute("text", en);
    }
}
