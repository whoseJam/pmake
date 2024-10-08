
export class Exit {
    static ordinary(parent, childName) {
        const child = parent.child(childName);
        if (child) {
            parent.eraseChild(child);
            child.opacity(0).remove();
        }
    }
}
