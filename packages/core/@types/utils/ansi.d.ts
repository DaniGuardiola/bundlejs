export declare const ESCAPE_TO_COLOR: {
    readonly "37": "dim";
    readonly "31": "red";
    readonly "32": "green";
    readonly "34": "blue";
    readonly "36": "cyan";
    readonly "35": "magenta";
    readonly "33": "yellow";
    readonly "41;31": "red-bg-red";
    readonly "41;97": "red-bg-white";
    readonly "42;32": "green-bg-green";
    readonly "42;97": "green-bg-white";
    readonly "44;34": "blue-bg-blue";
    readonly "44;97": "blue-bg-white";
    readonly "46;36": "cyan-bg-cyan";
    readonly "46;30": "cyan-bg-black";
    readonly "45;35": "magenta-bg-magenta";
    readonly "45;30": "magenta-bg-black";
    readonly "43;33": "yellow-bg-yellow";
    readonly "43;30": "yellow-bg-black";
};
export declare type Escape = "0" | "1" | "4" | keyof typeof ESCAPE_TO_COLOR;
export declare type Color = typeof ESCAPE_TO_COLOR[keyof typeof ESCAPE_TO_COLOR];
export declare function htmlEscape(string: string): string;
export declare class AnsiBuffer {
    result: string;
    _stack: string[];
    _bold: boolean;
    _underline: boolean;
    _link: boolean;
    text(text: string): void;
    reset(): void;
    bold(): void;
    underline(): void;
    last(): string;
    color(color: Color): void;
    done(): string;
}
export declare function render(ansi: string): string;
