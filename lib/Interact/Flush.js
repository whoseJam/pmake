export function initFlush() {
    window.minX = 1200;
    window.minY = 600;
    window.maxX = 0;
    window.maxY = 0;
    window.__FLUSH__ = false;
    window.addEventListener("message", (e) => {
        console.log(e.data, e.data.action);
        if (e.data.action === "flush") {
            window.__FLUSH__ = true;
            window.__EXPORT__ = e.data.export;
            window.localStorage.setItem("rate", e.data.rate);
        }
    });
}