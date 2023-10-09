
export * from "./array_like";
export * from "./code";

export function listen_to(leader, follower, update) {
    leader.listen("onX", update, follower);
    leader.listen("onY", update, follower);
    leader.listen("onWidth", update, follower);
    leader.listen("onHeight", update, follower);
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