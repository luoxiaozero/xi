enum RunModel{
    editor='editor', 
    read= 'read'
}
class Config{
    static RunModel = RunModel;
    
    renderFlag: boolean;
    md: string;
    runModel: RunModel;
    katex: any;
    hljs: any;
    theme: Map<any, any>
    constructor(config) {
        this.renderFlag = true;
        this.md = '';
        if(config.md){
            this.md = config.md;
        }
        
        this.runModel = RunModel.editor;// read
        if(config.runModel){
            this.runModel = config.runModel;
        }

        if(config.katex){
            this.katex = config.katex;
        }else{
            this.katex = {js: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js', css: 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css'}
        }

        if(config.hljs){
            this.hljs = config.hljs;
        }else{
            this.hljs = {js: 'https://libs.cdnjs.net/highlight.js/10.1.2/highlight.min.js', css: null}
        }
        this.theme = new Map([['backgroundColor', '#fff'], ['color', '#1abc9c']]);
    }
}
export default Config