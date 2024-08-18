import { GetLocationFromAncestor } from "./inject";

export function Image(Reveal) {
    Reveal.addEventListener('slidechanged', event => {
        const currentSlide = event.currentSlide;
        const images = currentSlide.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            let url = image.getAttribute("data-source");
            if (!url) continue;
            if (!url.startsWith("./image") && !url.startsWith("http") && !url.startsWith("image"))
                url = GetLocationFromAncestor(image) + "/" + url;
            image.setAttribute("src", url);
        }
    })
}