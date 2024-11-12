import { CopyStyles }     from "./Util";
import { ReplaceElement } from "./Util";

export function Picture() {
    return {
        id: "picture",
        init: function init(reveal) {
            const pictures = document.getElementsByTagName("picture");
            if (pictures.length === 0) return;

            const picture = pictures[0];
            const parent = picture.parentNode;
            const url = GetURL(picture);

            const div = document.createElement("div");
            const img = document.createElement("img");
            div.append(img);
            img.setAttribute("data-source", url);
            div.style["textAlign"] = "center";

            CopyStyles(picture, img, ["width", "height"]);
            ReplaceElement(parent, picture, div);
            
            init(reveal);
        }
    };
}

const URL_KEYS = [
    "src",
    "data-src",
    "data-source"
];

function GetURL(element) {
    for (let key of URL_KEYS) {
        const source = element.getAttribute(key);
        if (source) return source;
    }
    console.error(`Element ${element} Seem Do Not Have a Valid URL(src, data-src or data-source)`);
    return "";
}