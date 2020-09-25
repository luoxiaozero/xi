export enum RunModel {
    editor = 'editor',
    read = 'read',
    read_noStyle = 'read-noStyle',
}

export enum SecurityLevel {
    strict = 'strict',
    loose = 'loose',
}

export interface ArtOptions {
    markdown: string,
    fileInfo: {},
    runModel: RunModel,
    securityLevel: SecurityLevel,
    math: { name: string, js: string, css: string, jsFun: Function },
    code: { name: string, js: string, css: string, jsFun: Function },
    flowchart: { name: string, js: string[], css: string, jsFun: Function },
}

export const ART_DEFAULT_OPTIONS: ArtOptions = {
    markdown: '',
    fileInfo: {},
    runModel: RunModel.editor,
    securityLevel: SecurityLevel.strict,
    math: { name: 'katex', js: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js', css: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css', jsFun: null },
    code: { name: 'hljs', js: 'https://libs.cdnjs.net/highlight.js/10.1.2/highlight.min.js', css: null, jsFun: null },
    flowchart: { name: 'flowchart', js: ['https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.14.0/flowchart.min.js'], css: null, jsFun: null },
}
export const ART_THEME = {
    backgroundColor: '#fff',
    color: '#1abc9c',
}

export const ART_DEFAULT_CSS = '.art-main{}';

