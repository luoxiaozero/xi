import ArtText from "../../artText";
import { Art } from "../../core";
export declare let exportMdFile: {
    created: (art: Art, options: any) => void;
};
export declare let importMdFile: {
    created: (art: Art, options: any) => void;
};
export declare let newMdFileExport: {
    created: (art: Art, options: any) => void;
};
export declare let GithubExport: {
    created: (art: Art, options: any) => void;
};
export declare class SwitchRenderButton {
    artText: ArtText;
    spanElement: HTMLSpanElement;
    title: string;
    abbrNames: string[];
    renderNames: string[];
    constructor(artText: ArtText);
    addRender(abbrNames: string, renderName: string): void;
    click(): void;
}
export declare let switchRenderButtonExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
