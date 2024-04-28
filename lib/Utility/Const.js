
const dirtyChannelX = (1 << 0);
const dirtyChannelY = (1 << 1);
const dirtyChannelWidth = (1 << 2);
const dirtyChannelHeight = (1 << 3);

export const Const = {
    DirtyChannel: {
        x: (1 << 0),
        y: (1 << 1),
        width: (1 << 2),
        height: (1 << 3),
        r: (1 << 4),
        x1: (1 << 5),
        y1: (1 << 6),
        x2: (1 << 7),
        y2: (1 << 8),
        empty: (1 << 9),
        any: (1 << 10) - 1,
        cx: dirtyChannelX | dirtyChannelWidth,
        mx: dirtyChannelX | dirtyChannelWidth,
        kx: dirtyChannelX | dirtyChannelWidth,
        cy: dirtyChannelY | dirtyChannelHeight,
        my: dirtyChannelY | dirtyChannelHeight,
        ky: dirtyChannelY | dirtyChannelHeight
    }
}