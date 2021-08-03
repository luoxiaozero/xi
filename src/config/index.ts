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

export interface ToolbarItem {
    title: string;
    click?: (event: Event) => void;
}

export interface ArtOptions {
    defaultMd?: string,
    markdown?: string,
    fileInfo?: {},
    runModel?: RunModel,
    securityLevel?: SecurityLevel,
    toolbar?: ToolbarItem[]
}

export const ART_DEFAULT_OPTIONS: ArtOptions = {
    defaultMd: '',
    markdown: '',
    fileInfo: {},
    runModel: RunModel.editor,
    securityLevel: SecurityLevel.strict,
    toolbar: []
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