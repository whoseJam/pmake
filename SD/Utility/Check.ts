import { SDNode } from "@/Node/SDNode";
import { Color } from "./Color";

export class Check {
    static isFalse(object: any) {
        return object === null || object === undefined || object === false;
    }
    static isEmpty(object: any) {
        return object === null || object === undefined;
    }
    static isString(object: any) {
        return typeof object === "string";
    }
    static isOpacity(object: any) {
        if (typeof object !== "number") return false;
        return 0 <= object && object <= 1;
    }
    static isNumber(object: any) {
        return typeof object === "number" && !isNaN(object) && object !== Infinity && object !== -Infinity;
    }
    static isNumberOrString(object: any) {
        return typeof object === "number" || typeof object === "string";
    }
    static isVector(object: any) {
        return object && typeof object[0] === "number" && typeof object[1] === "number";
    }
    static isAsyncFunction(object: any) {
        if (typeof object !== "function") return false;
        const str = object.toString();
        return str.startsWith("async");
    }
    static isSyncFunction(object: any) {
        if (typeof object !== "function") return false;
        return !this.isAsyncFunction(object);
    }
    static validateOpacity(object: any, method: string, i = 1) {
        if (!this.isOpacity(object)) {
            throw new Error(
                `We expect an opacity for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateNumber(object: any, method: string, i = 1) {
        if (!this.isNumber(object)) {
            throw new Error(
                `We expect a number for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateString(object: any, method: string, i = 1) {
        if (!this.isString(object)) {
            throw new Error(
                `We expect a string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateNumberOrString(object: any, method: string, i = 1) {
        if (!this.isNumberOrString(object)) {
            throw new Error(
                `We expect a number or a string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateColor(object: any, method: string, i = 1) {
        if (!Color.isColor(object)) {
            throw new Error(
                `We expect a hex-color or a { fill: hex-color, stroke: hex-color } for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateSyncFunction(object: any, method: string, i = 1) {
        if (!this.isSyncFunction(object)) {
            throw new Error(
                `We expect a synchronized function for the ${this.generateLocation(
                    i
                )} argument when calling the ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateLocation(object: any, locations: ReadonlySet<string>, method: string, i = 1) {
        if (!locations.has(object)) {
            throw new Error(
                `We expect a location-string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateDirection(object: any, directions: ReadonlySet<string>, method: string, i = 1) {
        if (!directions.has(object)) {
            throw new Error(
                `We expect a direction-string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateAlign(object: any, aligns: ReadonlySet<string>, method: string, i = 1) {
        if (!aligns.has(object)) {
            throw new Error(
                `We expect a align-string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateJustify(object: any, justifies: ReadonlySet<string>, method: string, i = 1) {
        if (!justifies.has(object)) {
            throw new Error(
                `We expect a justify-string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateOrigin(object: any, origins: ReadonlySet<string>, method: string, i = 1) {
        if (!origins.has(object)) {
            throw new Error(
                `We expect a origin-string for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateSDNode(object: any, method: string, i = 1) {
        if (!(object instanceof SDNode)) {
            throw new Error(
                `We expect a SDNode for the ${this.generateLocation(
                    i
                )} argument when calling ${method} but got <${object}>[type is ${typeof object}].`
            );
        }
    }
    static validateArgumentsCountEqualTo(args: Array<any>, count: number, method: string) {
        if (args.length !== count)
            throw new Error(`The ${method} expect ${count} arguments, but got ${args.length} arguments.`);
    }

    // Helper methods
    private static generateLocation(i: number) {
        if (i === 1) return "1st";
        if (i === 2) return "2nd";
        if (i === 3) return "3rd";
        return `${i}th`;
    }
}
