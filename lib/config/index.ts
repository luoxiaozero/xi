export const ART_DEFAULT_OPTIONS = {
    markdown: '',
    runModel: 'editor', // editor: default, read, read-noStyle
    securityLevel: 'strict', // strict: default, loose
    math: {name: 'katex', js: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js', css: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css'},
    code: {name: 'hljs', js: 'https://libs.cdnjs.net/highlight.js/10.1.2/highlight.min.js', css: null},
    flowchart: {js: ['https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.14.0/flowchart.min.js'], css: null},
    theme: {backgroundColor: '#fff', color: '#1abc9c'}
}
  