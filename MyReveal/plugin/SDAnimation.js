import { GetLocationFromAncestor} from "../Inject";

function inDecktapeEnvironment() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("headlesschrome");
}

const needToExportAsPdf = inDecktapeEnvironment();

export function SDAnimation() {
    return { id: "SDAnimation", init: Init };
}

function OnBoxLoad(iframe, cache, url) {
    if (arguments.length === 3 && !cache[url].box) throw new Error(`cannot find box named ${url}`);
    const box = (arguments.length === 2) ? cache : cache[url].box;
    return () => {
        GetMessage(iframe).Message("IFRAME_NAME", url);
        GetMessage(iframe).Message("IFRAME_ID", iframe.id);
        SetAnimationSize(iframe, box);
    }
}

function OnFlushLoad(iframe, url) {
    return () => {
        const outerBox = GetBoundingBox(iframe);
        const maxFrame = GetMaxFrame(iframe);
        GetMessage(iframe).Flush(
            iframe.id,
            url,
            outerBox.width,
            outerBox.height,
            GetRate(iframe),
            needToExportAsPdf,
            maxFrame
        );
    }
}

function Init(reveal) {
    const cache = {};

    reveal.addEventListener("slidechanged", (event) => {
        const iframes = [...event.currentSlide.getElementsByTagName("iframe")];
        iframes.forEach(iframe => ProcessIframe(iframe, cache));
    });

    reveal.on("fragmentshown", (event) => {
        if (event.fragment.tagName === "iframe") {
            ProcessIframe(event.fragment, cache);
        }
    });

    window.SetAnimationSize = (id, url, x, y, width, height) => {
        cache[url].box = new DOMRect(x, y, width, height);
        const iframe = document.getElementById(id);
        iframe.onload = OnBoxLoad(iframe, cache, url);
    }

    window.ResetAnimationSize = (id, url) => {
        const iframe = document.getElementById(id);
        iframe.onload = OnBoxLoad(iframe, cache, url);
    }
}

let iframeID = 0;

function ProcessIframe(iframe, cache) {
    if (!iframe.id) iframe.id = ++iframeID;
    const url = GetURL(iframe);
    if (!url) return;
    iframe.setAttribute("src", url);
    if (!(url in cache)) CreateCacheItem(cache, url);
    const viewBox = GetViewBox(iframe);
    const prevBox = cache[url].box;
    if (viewBox) {
        const args = viewBox.split(" ").map(Number);
        iframe.onload = OnBoxLoad(iframe, { x: args[0], y: args[1], width: args[2], height: args[3] });
    } else if (prevBox) {
        iframe.onload = OnBoxLoad(iframe, cache, url);
    } else {
        iframe.onload = OnFlushLoad(iframe, url);
    }
}

function GetURL(iframe) {
    let url = iframe.getAttribute("data-animation");
    if (!url) url = iframe.getAttribute("data-src");
    if (!url) return undefined;
    if (url.endsWith(".js")) url = url.replace(".js", ".html");
    if (url.startsWith("./animation") || url.startsWith("http") || url.startsWith("animation")) return url;
    const location = GetLocationFromAncestor(iframe);
    if (location) return location + "/" + url;
    return url;
}

function GetViewBox(iframe) {
    return iframe.getAttribute("data-viewBox");
}

function GetViewBoxDelta(iframe) {
    return iframe.getAttribute("data-viewBoxDelta");
}

function GetMaxFrame(iframe) {
    const maxFrame = iframe.getAttribute("data-maxFrame");
    if (maxFrame) return maxFrame;
    return Infinity;
}

function GetMessage(iframe) {
    if (!iframe.contentWindow)
        return undefined;
    if (iframe.contentWindow["SDAnimation"])
        return iframe.contentWindow;
    return undefined;
}

function CreateCacheItem(cache, url) {
    cache[url] = { url: url, box: undefined };
}

function GetRate(iframe) {
    const viewBox = GetViewBox(iframe);
    if (viewBox) return 1;
    const rate = iframe.getAttribute("rate");
    return rate ? +rate : 1.05;
}

function GetBoundingBox(iframe) {
    const box = iframe.getBoundingClientRect();
    return box;
}

/**
 * box 表示 svg 画布内的元素占据的盒子大小
 */
function SetAnimationSize(iframe, box) {
    const rate = GetRate(iframe);
    const boundingBox = GetBoundingBox(iframe);
    const viewBoxDelta = GetViewBoxDelta(iframe);
    const delta = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (viewBoxDelta) {
        const tmp = viewBoxDelta.split(" ");
        delta.x = +tmp[0];
        delta.y = +tmp[1];
        delta.width = +tmp[2];
        delta.height = +tmp[3];
    }
    GetMessage(iframe).SetViewBox(
        box.x + delta.x,
        box.y + delta.y,
        box.width + delta.width,
        box.height + delta.height,
        boundingBox.width,
        boundingBox.height,
        rate
    );
}
