import Render from "..";

export default class TextareaRender implements Render{
    static DEFAULT_CSS: string = '.art-editor-md{width:100%;min-height:200px;border:none;outline:none;resize:none;display:none}'
    static Name = 'TextareaRender';

    dom: HTMLTextAreaElement;
    abbrName: string;
    constructor(){
        this.abbrName = 'Text'
    }

    public createDom(): HTMLTextAreaElement{
        this.dom = document.createElement('textarea');
        this.dom.setAttribute('class', 'art-editor-md')
        this.dom.addEventListener('input', function (e) {
            (<HTMLHtmlElement>e.target).style.height = this.scrollHeight + 'px';
        })
        return this.dom;
    }

    public open(): void {
        this.dom.style.display = 'inherit';
    }

    public close(): void {
        this.dom.style.display = 'none';
    }

    public getMd(): string{
        return this.dom.value;
    }

    public setMd(md: string): void{
        this.dom.value = md;
        this.dom.style.height = this.dom.scrollHeight + 5 + 'px';
    }
}