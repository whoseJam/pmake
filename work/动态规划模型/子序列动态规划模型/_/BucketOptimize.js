import * as sd from "@/sd";

/**
 * @param {sd.BaseArray} arr 
 * @param {{
 *  OnCreateFirstBucket: (arr: sd.BaseArary, cx: number) => void
 *  OnCreateBucket: (arr: sd.BaseArary, i: number) => void
 *  OnUpdateBucket: (arr: sd.BaseArary, j: number) => void
 *  OnUpdateCurrent: (arr: sd.BaseArary, i: number) => void
 * }} args 
 */
export async function BucketOptimize(arr, posI, args) {
    const OnCreateFirstBucket = args.OnCreateFirstBucket;
    const OnCreateBucket = args.OnCreateBucket;
    const OnUpdateBucket = args.OnUpdateBucket;
    const OnUpdateCurrent = args.OnUpdateCurrent;

    if (OnCreateFirstBucket) {
        await OnCreateFirstBucket(arr, arr.firstElement().cx() - arr.elementWidth());
    }
    for (let i = arr.start(); i <= posI; i++) {
        if (OnCreateBucket) {
            await OnCreateBucket(arr, i);
        }
    }
    for (let i = arr.start(); i < posI; i++) {
        if (OnUpdateBucket) {
            await OnUpdateBucket(arr, i);
        }
    }
    if (OnUpdateCurrent) {
        await OnUpdateCurrent(arr, posI);
    }
}