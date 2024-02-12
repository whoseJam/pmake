

// function height(height) {
//     if (typeof(height) === "undefined")
//         return this.r() * 2;
//     return this.r(height / 2);
// }

// function nw_resize(e) {
//     let x = this.x();
//     let y = this.y();
//     let width = this.width();
//     let height = this.height();
//     if (this.width() - e.dx >= MINW || e.dx < 0)
//         this.x(x + e.dx)
//             .width(width - e.dx)
//             .y(y + e.dx)
//             .height(height - e.dx);
// }

// function ne_resize(e) {
//     let y = this.y();
//     let width = this.width();
//     let height = this.height();
//     if (this.width() + e.dx >= MINW || e.dx > 0)
//         this.y(y - e.dx)
//             .height(height + e.dx)
//             .width(width + e.dx);
// }

// function sw_resize(e) {
//     let x = this.x();
//     let width = this.width();
//     let height = this.height();
//     if (this.width() - e.dx >= MINW || e.dx < 0)
//         this.x(x + e.dx)
//             .width(width - e.dx)
//             .height(height - e.dx);
// }