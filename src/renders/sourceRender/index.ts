import ArtText from "@/artText";
import { Art } from "@/core";
import Editor from "@/editor";
import EventCenter from "@/eventCenter";
import Render from "..";
import VNode from "../artRender/node";
import Parser from "../artRender/parser";
import Root from "./components/Root";
import "./index.css";

export default class SourceRender implements Render{

    abbrName: string = 'Source';
    artText: ArtText;
    dom: HTMLDivElement;
    DOMEvents: string[] = [];
    doc: Root;
    constructor(artText: ArtText){
        this.artText = artText;
    }

    public createDom(): HTMLDivElement{
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-editor-source')
        return this.dom;
    }

    public open(): void {
        this.dom.style.display = 'inherit';
    }

    public close(): void {
        this.dom.style.display = 'none';
    }

    public getMd(): string{
        return this.doc.toMd();;
    }

    public setMd(md: string): void{
        const parser = new Parser({});
        this.dom.innerHTML = "";
        this.doc = new Root(parser.parse(md), this.dom);
    }

    public attachAllEvent(): void {
    }

    public detachAllEvent(): void {
    } 
}

export let sourceRenderRenderExport = {
    install: function (Art, options) {
        options['container'].bind('sourceRender', SourceRender, [{'get': 'art'}], true);        
    },
    created: function (art: Art, options) {
        art.get<Editor>('$editor').addRender('sourceRender', art.get('sourceRender'));
    }
}