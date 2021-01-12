/**
 * 运行模式
 */
export enum RunModel {
    editor = 'editor',
    read = 'read',
    read_noStyle = 'read-noStyle',
}

/**
 * 
 */
export enum SecurityLevel {
    strict = 'strict', // 严格
    loose = 'loose', // 宽松
}

export interface ArtOptions {
    defaultMd: string,
    markdown: string,
    fileInfo: {},
    runModel: RunModel,
    securityLevel: SecurityLevel,
}

export const ART_DEFAULT_OPTIONS: ArtOptions = {
    defaultMd: '',
    markdown: '',
    fileInfo: {},
    runModel: RunModel.editor,
    securityLevel: SecurityLevel.strict,
}
export const ART_THEME = {
    backgroundColor: '#fff',
    color: '#1abc9c',
}

export const ART_DEFAULT_CSS = '.art-main{}';

export class Config {
    static theme = ART_THEME;
}

export const win = window;