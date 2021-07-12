import ArtText from "@/artText";
import { Art } from "@/core";
import Render from "..";
export default class TextareaRender implements Render {
    abbrName: string;
    artText: ArtText;
    dom: HTMLTextAreaElement;
    DOMEvents: string[];
    constructor(artText: ArtText);
    createDom(): HTMLTextAreaElement;
    open(): void;
    close(): void;
    getMd(): string;
    setMd(md: string): void;
    attachAllEvent(): void;
    detachAllEvent(): void;
}
export declare let TextareaRenderExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
