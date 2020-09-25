import ArtText from "lib";
import Render from "..";

export default class TextareaRender implements Render{
    dom: HTMLTextAreaElement;
    abbrName: string;

    constructor(){
        this.abbrName = 'Text'
        ArtText.DEFAULT_CSS += '.art-editor-md{width:100%;min-height:200px;border:none;outline:none;resize:none;display:none}'
    }
    public createDom(): HTMLTextAreaElement{
        this.dom = document.createElement('textarea');
        this.dom.setAttribute('class', 'art-editor-md')
        this.dom.addEventListener('input', function (e) {
            (<HTMLHtmlElement>e.target).style.height = this.scrollHeight + 'px';
        })
        return this.dom;
    }
    init(){
        
    }

    public open(): void {
        this.dom.style.display = 'inherit';
    }

    public close(): void {
        this.dom.style.display = 'none';
    }

    public getMd(){
        return this.dom.value;
    }

    public setMd(md: string){
        this.dom.value = md;
        this.dom.style.height = this.dom.scrollHeight + 5 + 'px';
    }
}