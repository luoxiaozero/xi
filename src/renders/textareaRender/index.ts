import ArtText from "@/artText";
import EventCenter from "@/eventCenter";
import Render from "..";

export default class TextareaRender implements Render{
    static DEFAULT_CSS: string = '.art-editor-md{width:100%;min-height:200px;border:none;outline:none;resize:none;display:none}'
    static Name = 'TextareaRender';

    abbrName: string = 'Text';
    artText: ArtText;
    dom: HTMLTextAreaElement;
    DOMEvents: string[] = [];
    constructor(artText: ArtText){
        this.artText = artText;
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

    public attachAllEvent(): void {
        const dom = this.dom;
        let id = this.artText.get<EventCenter>('$eventCenter').attachDOMEvent(this.dom, 'input', 
            e => (<HTMLHtmlElement>e.target).style.height = dom.scrollHeight + 'px');
        this.DOMEvents.push(id);
    }

    public detachAllEvent(): void {
        for (let id of this.DOMEvents) {
            this.artText.get<EventCenter>('$eventCenter').detachDOMEvent(id);
        }
    } 
}