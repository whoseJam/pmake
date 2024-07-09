
interface ValueBoardType {
    value(): number;
    value(value: number): this;
}

export function ValueBoard(name: string, initial: any): ValueBoardType;