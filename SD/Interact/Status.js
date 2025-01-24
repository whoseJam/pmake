import { Dom } from "@/Dom/Dom";
import { Device as D } from "@/Interact/Device";
import { render } from "react-dom";

function reload() {
    window.parent.ResetAnimationSize(window.IFRAME_ID, window.IFRAME_URL);
    window.location.reload();
}

export class Status {
    static init() {
        const element = (
            <div id="wrapper" style={{ position: "fixed", left: "10px", top: "10px", width: "60px", height: "20px", display: "flex", opacity: 1 }}>
                <div style={{ width: "20px", height: "20px" }}>
                    <div id="frameStatus" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "green", translate: "5px 5px" }}></div>
                </div>
                <div style={{ width: "20px", height: "20px" }}>
                    <i className="sync icon" onClick={reload}></i>
                </div>
            </div>
        );

        const div = Dom.createElementAndAppendToBody("div");
        render(element, div);
        Status.frameStatus = Dom.getByID("frameStatus");

        const wrapper = Dom.getByID("wrapper");
        D.onKeyDown("t", () => {
            wrapper.style["opacity"] ^= 1;
        });

        const watermark = (
            <div style={{
                position: "fixed", 
                bottom: "10px", 
                right: "10px", 
                fontSize: "15px", 
                color: "rgba(0, 0, 0, 0.3)", 
                pointerEvents: "none"
            }}>
                power by whoseJam
            </div>
        );
        const watermarkDiv = Dom.createElementAndAppendToBody("div");
        render(watermark, watermarkDiv);
    }

    static updateFrameStatus() {
        let ban = false;
        if (window.IS_CONTINUING) ban = true;
        if (window.IS_INTERACTING) ban = true;
        if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) ban = true;
        Status.frameStatus.style["backgroundColor"] = ban ? "red" : "green";
    }
}
