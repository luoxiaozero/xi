class Config{
    constructor(config) {
        this.renderFlag = true;
        this.md = '';
        if(config.md){
            this.md = config.md;
        }
        
        this.model = 'editor';// read
        if(config.model){
            this.model = config.model;
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
        this.theme ={backgroundColor: '#fff', color: '#1abc9c'}
    }
}export default Config