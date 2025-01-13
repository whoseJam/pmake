export function reactive<T>(object: T): T & {
    associate(key: string, func: any);
};
