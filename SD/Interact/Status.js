import { Dom } from "@/Dom/Dom";
import { Device as D } from "@/Interact/Device";

function reload() {
    if (window.parent) {
        window.parent.postMessage({
            operator: "ResetAnimationSize",
            arguments: [window.IFRAME_ID, window.IFRAME_URL],
        });
    }
    window.location.reload();
}

const RELOAD_ICON = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M454.016 100.48a416.128 416.128 0 0 1 437.632 241.92 416 416 0 1 1-772.032 308.224L149.76 640l30.272-10.688a352.128 352.128 0 0 0 675.2-38.784 352.128 352.128 0 0 0-172.928-386.24 352.064 352.064 0 0 0-419.008 58.944l-0.64 0.704-139.136 130.752h175.232a32 32 0 0 1 0 64h-256l-0.768-0.128c-0.896 0-1.792-0.128-2.688-0.256-1.152-0.128-2.24-0.192-3.328-0.448a31.808 31.808 0 0 1-4.096-1.28l-1.92-0.576-1.984-1.088c-1.28-0.64-2.432-1.28-3.52-2.048l-1.024-0.768a32 32 0 0 1-3.84-3.328l-0.128-0.192-0.896-1.152a31.936 31.936 0 0 1-2.816-3.648L14.592 441.6c-0.64-1.024-1.216-2.112-1.664-3.264a31.808 31.808 0 0 1-1.024-3.392 32 32 0 0 1-1.088-6.656l-0.128-1.664v-256a32 32 0 0 1 64 0V352.64l144.064-135.296a416 416 0 0 1 235.264-116.928z" p-id="1169"></path><path d="M139.136 609.792a32 32 0 0 1 40.832 19.52l-60.352 21.312a32 32 0 0 1 19.52-40.832z" p-id="1170"></path></svg>`;
const LEFT_ARROW_ICON = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M534.656 190.72a32 32 0 0 0-45.312 0L190.72 489.408a31.808 31.808 0 0 0-5.76 8.192l-1.088 2.24a32 32 0 0 0 6.848 34.816l298.688 298.624a32 32 0 1 0 45.312-45.248L290.688 544h520a32 32 0 0 0 0-64H290.56l244.096-244.032a32 32 0 0 0 0-45.248z" p-id="1490"></path></svg>`;
const RIGHT_ARROW_ICON = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M489.344 190.72a32 32 0 0 1 45.312 0l298.688 298.688a32 32 0 0 1 5.76 8.192l1.088 2.24a32 32 0 0 1-6.848 34.816L534.656 833.28a32 32 0 1 1-45.312-45.248L733.312 544H213.312a32 32 0 0 1 0-64h520.128L489.344 235.968a32 32 0 0 1 0-45.248z" p-id="1330"></path></svg>`;

export class Status {
    static init() {
        const element = Dom.createElementAndAppendToBody("div");
        element.innerHTML = `
        <div id="buttons" style="position: fixed; left: 10px; top: 10px; width: 80px; height: 20px; display: flex; opacity: 1;">
            <div style="width: 20px; height: 20px;">
                <div id="status" style="width: 10px; height: 10px; border-radius: 50%; background-color: green; translate: 5px 5px;"></div>
            </div>
            <div style="width: 20px; height: 20px; margin-left:" id="reload">${RELOAD_ICON}</div>
            <div style="width: 20px; height: 20px;" id="prev">${LEFT_ARROW_ICON}</div>
            <div style="width: 20px; height: 20px;" id="next">${RIGHT_ARROW_ICON}</div>
        </div>
        `;

        Status.status = Dom.getByID("status");
        Dom.addEventListener(Dom.getByID("reload"), "click", () => reload());
        Dom.addEventListener(Dom.getByID("prev"), "click", () => D.keyDown("P"));
        Dom.addEventListener(Dom.getByID("next"), "click", () => D.keyDown("N"));
        D.onKeyDown("t", () => (Dom.getByID("buttons").style["opacity"] ^= 1));
    }

    static updateFrameStatus() {
        Status.status.style["backgroundColor"] = this.isInteractable() ? "green" : "red";
    }

    static isInteractable() {
        if (window.IS_CONTINUING) return false;
        if (window.IS_INTERACTING) return false;
        if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) return false;
        return true;
    }
}
