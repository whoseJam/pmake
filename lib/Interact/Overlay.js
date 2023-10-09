import { Rect } from "../Structure/Basic/Rect";

export function INIT_OVERLAY(svg) {
    svg.on("mousedown", () => {
        if (overlayClicked) {
            overlayClicked = false;
            return;
        }
        focus?.deactivate();
        focus = null;
    })
}

let focus;
let overlayClicked = false;

export function Overlay(self, layer) {
    let svg = (layer === undefined ? self : layer);

    function overlay(delta) {
        let cnt = this.get("overlayCount") + delta;
        this.set("overlayCount", cnt);
        let overlay = this.get("overlay");
        if (overlay === null && cnt > 0) {
            let overlay = Rect({ svg: svg, mode: "easy", hsj: true });
            let x = this.x(), width = this.width();
            let y = this.y(), height = this.height();
            overlay.fillOpacity(0);
            overlay.strokeOpacity(0);
            overlay.x(x).y(y);
            overlay.width(width);
            overlay.height(height);
            overlay.clickable(true);
            this.set("overlay", overlay, true);
            this.get("overlay").basic()
                .on("mousedown", onClick.bind(this));
        } else if (overlay && cnt === 0) {
            overlay.remove();
            this.set("overlay", null, true);
        }
    }

    self.set("overlay", null);
    self.set("overlayCount", 0);
    
    self.activate = activate;
    self.deactivate = deactivate;
    self.isActivated = isActivated;
    self.overlay = overlay;

    self.listen("onX", onX); self.listen("onWidth", onWidth);
    self.listen("onY", onY); self.listen("onHeight", onHeight);

    return self;
}

function activate() {
    let overlay = this.get("overlay");
    overlay.stroke("rgb(0, 209, 222)");
    overlay.strokeOpacity(1);
    overlay.strokeWidth(2);
    if (focus !== this) {
        focus?.deactivate();
        focus = this;
        this.call("onActivate");
    }
}

function deactivate() {
    let overlay = this.get("overlay");
    overlay.strokeOpacity(0);
    this.call("onDeactivate");
}

function isActivated() {
    return this === focus;
}

function onX() {
    let overlay = this.get("overlay");
    if (overlay) overlay.x(this.x());
}

function onY() {
    let overlay = this.get("overlay");
    if (overlay) overlay.y(this.y());
}

function onWidth() {
    let overlay = this.get("overlay");
    if (overlay) {
        let w = Math.max(this.width(), 5);
        overlay.width(w);
    }
}

function onHeight() {
    let overlay = this.get("overlay");
    if (overlay) {
        let h = Math.max(this.height(), 5);
        overlay.height(h);
    }
}

function onClick() {
    window.__frame__++;
    overlayClicked = (!this.isActivated());
    this.activate();
}
