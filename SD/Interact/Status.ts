import { Dom } from "@/Dom/Dom";
import { Device as D } from "@/Interact/Device";
import { Window } from "@/Animate/Window";

function reload(): void {
    if (window.parent) {
        window.parent.postMessage({
            operator: "ResetAnimationSize",
            arguments: [Window.IFRAME_ID, Window.IFRAME_URL],
        });
    }
    window.location.reload();
}

const RELOAD_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>`;
const LEFT_ARROW_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
const RIGHT_ARROW_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
const DESCRIPTION_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;

export class Status {
    static status: HTMLElement;
    static description: HTMLElement;

    static init(): void {
        const element = Dom.createElementAndAppendToBody("div");
        element.innerHTML = `
        <div id="buttons" style="position: fixed; left: 10px; top: 10px; width: 100px; height: 20px; display: flex; opacity: 1;">
            <div style="width: 20px; height: 20px;">
                <div id="status" style="width: 10px; height: 10px; border-radius: 50%; background-color: green; translate: 5px 5px;"></div>
            </div>
            <div style="width: 20px; height: 20px; margin-left:" id="reload">${RELOAD_ICON}</div>
            <div style="width: 20px; height: 20px;" id="prev">${LEFT_ARROW_ICON}</div>
            <div style="width: 20px; height: 20px;" id="next">${RIGHT_ARROW_ICON}</div>
            <div style="width: 20px; height: 20px; position: relative; cursor: pointer;" id="detail">
                ${DESCRIPTION_ICON}
                <div id="description" style="display: none; position: absolute; left: 25px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 8px 12px; border-radius: 4px; white-space: nowrap; font-size: 12px; z-index: 1000;">暂无简介</div>
            </div>
        </div>
        `;

        Status.status = Dom.getHTMLByID("status");
        Dom.addEventListener(Dom.getByID("reload"), "click", () => reload());
        Dom.addEventListener(Dom.getByID("prev"), "click", () => D.keyDown("P"));
        Dom.addEventListener(Dom.getByID("next"), "click", () => D.keyDown("N"));

        const detail = Dom.getHTMLByID("detail");
        this.description = Dom.getHTMLByID("description");
        Dom.addEventListener(detail, "mouseenter", () => {
            this.description.style.display = "block";
        });
        Dom.addEventListener(detail, "mouseleave", () => {
            this.description.style.display = "none";
        });

        D.onKeyDown("tT", () => {
            const buttons = Dom.getHTMLByID("buttons");
            const opacity = +buttons.style["opacity"];
            buttons.style["opacity"] = String(opacity ^ 1);
        });
    }

    static updateFrameStatus(): void {
        Status.status.style["backgroundColor"] = this.isInteractable() ? "green" : "red";
    }

    static isInteractable(): boolean {
        if (Window.IS_CONTINUING) return false;
        if (Window.IS_INTERACTING) return false;
        if (Window.MAXIMUM_FRAME !== Window.CURRENT_FRAME) return false;
        return true;
    }

    static setDescription(description: string) {
        this.description.innerHTML = description;
    }
}
