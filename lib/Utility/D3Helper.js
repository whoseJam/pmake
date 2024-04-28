
export const D3Helper = {
    nake: nake,
    element: element,
}

function nake(selection) {
    return selection._groups[0][0];
}

function element(selection) {
    return selection._groups[0][0];
}