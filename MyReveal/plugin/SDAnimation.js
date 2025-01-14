import { configure, has, start, stop, update } from "../../SDIFrame/SDIFrame";
import { GetLocationFromAncestor } from "../Inject";

export function SDAnimation() {
    return { id: "SDAnimation", init };
}

function init(reveal) {
    reveal.addEventListener("slidechanged", event => {
        const currentSlide = event.currentSlide;
        const previousSlide = event.previousSlide;
        if (previousSlide) {
            const iframes = previousSlide.querySelectorAll("iframe[data-animation]");
            for (let i = 0; i < iframes.length; i++) stop(iframes[i]);
        }

        const iframes = currentSlide.querySelectorAll("iframe[data-animation]");
        for (let i = 0; i < iframes.length; i++) {
            if (has(iframes[i])) start(iframes[i]);
            else update(iframes[i]);
        }
    });

    configure({
        getURL,
    });
}

function getURL(iframe) {
    let url = iframe.getAttribute("data-animation");
    if (url.endsWith(".js")) url = url.replace(".js", ".html");
    if (url.startsWith("./animation") || url.startsWith("http") || url.startsWith("animation")) return url;
    const location = GetLocationFromAncestor(iframe);
    if (location) return location + "/" + url;
    return url;
}
