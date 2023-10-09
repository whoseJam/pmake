
export * from "./array_like";
export * from "./code";

export function listen_to(leader, follower, update) {
    leader.listen("on_x", update, follower);
    leader.listen("on_y", update, follower);
    leader.listen("on_width", update, follower);
    leader.listen("on_height", update, follower);
}

export function text_switch(txt, str) {
    txt.start_animate()
       .opacity(0).dx(40)
       .end_aniamte()
       .text(str).dx(-80)
       .start_animate()
       .opacity(1).dx(40)
       .end_aniamte();
}

export function appear(ele) {
    ele.dx(-40).opacity(0)
       .start_animate()
       .dx(40).opacity(1)
       .end_aniamte();
}