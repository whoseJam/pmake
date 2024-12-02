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
    
    static fade() {
        return function(element) {
            element.opacity(0);
            element.remove();
        }
    }

    static drop(parent, child) {
        if (arguments.length === 2) {
            return function() {
                const erase = typeof(child) === "string" ? parent.child(child) : child;
                if (!erase) return;
                erase.after(parent.delay());
                erase.attachTo(svg());
            }
        }
        return function(element) {
            element.after(this.delay());
            element.attachTo(svg());
        }
    }
}

export function exit() {
    return Exit;
}