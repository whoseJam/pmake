
export const Enter = {
    Ordinary(parent, layer = undefined) {
        return function(element, move) {
            element.opacity(0);
            element.update();
            element.attachTo(layer ? parent.layer(layer) : parent);
            element.after(parent);
            move();
            element.update();
            element.startAnimate(parent);
            element.opacity(1);
        };
    },

    FromExist(parent, layer = undefined) {
        return function(element, move) {
            element.attachTo(layer ? parent.layer(layer) : parent);
            element.startAnimate(parent);
            move();
            element.opacity(1);
        }
    },
    
    FromExistValue(parent, value, layer = undefined) {
        return function(element, move) {
            element.attachTo(layer ? parent.layer(layer) : parent);
            element.opacity(0);
            move();
            element.update();
            element.startAnimate(parent);
            element.opacity(1);
            element.valueFromExist(value);
        }
    }
}