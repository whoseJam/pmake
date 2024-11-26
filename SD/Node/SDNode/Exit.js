import { svg } from "@/Interact/RootSvg";

export class Exit {
    
    static naive(parent, child) {
        const erase = typeof(child) === "string" ? parent.child(child) : child;
        if (!erase) return;
        erase.opacity(0).remove();
    }

    static ordinary(parent, child) {
        const erase = typeof(child) === "string" ? parent.child(child) : child;
        if (!erase) return;
        parent.eraseChild(erase);
        erase.opacity(0).remove();
    }

    static drop(parent, child) {
        return function() {
            const erase = typeof(child) === "string" ? parent.child(child) : child;
            if (!erase) return;
            erase.after(parent.delay());
            erase.attachTo(svg());
        }
    }
}
