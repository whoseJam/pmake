
export function Grid() {
    let self = {};
    
    self._.x = 0;
    self._.y = 0;
    self._.elementWidth = 50;
    self._.elementHeight = 50;

    self.put = put;

    return self;
}

function put(x, y, elem) {
    let nx = x * self._.elementWidth + self._.x;
    let ny = y * self._.elementHeight + self._.y;
    elem.x(nx).y(ny);
}