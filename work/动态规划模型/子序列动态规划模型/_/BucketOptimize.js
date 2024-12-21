import * as sd from "@/sd";

/**
 * @param {sd.BaseArray} arr 
 * @param {*} args 
 */
export async function BucketOptimize(arr, args) {
    const OnCreateBucket = args.OnCreateBucket;
    for (let i = arr.start(); i <= arr.end(); i++) {
        const stk = new sd.Stack(arr).elementWidth(15).elementHeight(15);

    }
}