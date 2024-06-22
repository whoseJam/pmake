
export function int(x: any): number {
    return ~~x;
}

export function make1d(length: number): Array<number>
export function make1d(length: number, defaultValue: any): Array<any>
export function make1d(length: number, defaultValue: any = 0): Array<any> {
    const result: Array<any> = [];
    for (let i = 0; i < length; i++) {
        result.push(defaultValue);
    } 
    return result;
}

export function make2d(rows: number, columns: number): Array<Array<number>>
export function make2d(rows: number, columns: number, defaultValue: any): Array<any>
export function make2d(rows: number, columns: number, defaultValue: any = 0): Array<Array<any>> {
    const result: Array<Array<any>> = [];
    for (let i = 0; i < rows; i++) {
        result.push(make1d(columns, defaultValue));
    }
    return result;
}