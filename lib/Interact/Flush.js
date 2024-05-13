import { globalUpdate } from "./Svg";

export function initFlush() {
    window.minX = 1200;
    window.minY = 600;
    window.maxX = 0;
    window.maxY = 0;
    window.__FLUSH__ = false;
    window.addEventListener("message", (e) => {
        if (e.data.action === "flush") {
            console.log("flush this animation");
            window.__FLUSH__ = true;
            window.__EXPORT__ = e.data.export;
            globalUpdate();
            window.localStorage.setItem("rate", e.data.rate);
            window.localStorage.setItem("width", e.data.width);
            window.localStorage.setItem("height", e.data.height);
        }
    });
}