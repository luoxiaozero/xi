/**
 * 运行模式
 */
export declare enum RunModel {
    editor = "editor",
    read = "read",
    read_noStyle = "read-noStyle"
}
/**
 *
 */
export declare enum SecurityLevel {
    strict = "strict",
    loose = "loose"
}
export interface ArtOptions {
    defaultMd?: string;
    markdown?: string;
    fileInfo?: {};
    runModel?: RunModel;
    securityLevel?: SecurityLevel;
}
export declare const ART_DEFAULT_OPTIONS: ArtOptions;
export declare const ART_THEME: {
    backgroundColor: string;
    color: string;
};
export declare const ART_DEFAULT_CSS = ".art-main{}";
export declare class Config {
    static theme: {
        backgroundColor: string;
        color: string;
    };
}
export declare const win: Window & typeof globalThis;
