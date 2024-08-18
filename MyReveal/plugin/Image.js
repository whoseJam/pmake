import { GetLocationFromAncestor } from "../inject";

export function Image() {
    return { id: "image", init: Init };
}

function Init(reveal) {
    reveal.addEventListener("slidechanged", event => {
        const currentSlide = event.currentSlide;
        const images = currentSlide.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            image.setAttribute("src", GetURL(image));
        }
    })
}

function GetURL(image) {
    let url = image.getAttribute("data-source");
    if (!url) return undefined;
    if (url.startsWith("./image") || url.startsWith("http") || url.startsWith("image")) return url;
    return GetLocationFromAncestor(image) + "/" + url;
}