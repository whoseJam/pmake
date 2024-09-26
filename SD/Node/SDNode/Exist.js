
export const Exist = {
    Ordinary(parent, childName) {
        const child = parent.child(childName);
        if (child) {
            parent.children.erase(child);
            child.opacity(0).remove();
        }
    }
}