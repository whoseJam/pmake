
export const Enter = {
    Ordinary(parent) {
        return function(element, move) {
            element.attachTo(parent);
            element.after(parent);
            element.opacity(0);
            move();
            element.update();
            element.startAnimate(parent);
            element.opacity(1);
        };
    },
    FromExist(parent) {

    }
}