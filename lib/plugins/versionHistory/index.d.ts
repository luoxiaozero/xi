import { Art } from "../../core";
/**打开历史版本工具 */
export declare let openVersionHistory: {
    created: (art: Art, options: any) => void;
};
/**保存md文本*/
export declare let saveMdFile: {
    created: (art: Art, options: any) => void;
};
export default class VersionHistory {
    art: Art;
    dom: HTMLDivElement;
    maskLayer: HTMLDivElement;
    art_articles: {};
    sideDraftHistoryDirectory: HTMLDivElement;
    mainArticle: HTMLDivElement;
    footerDel: HTMLSpanElement;
    footerRestore: HTMLSpanElement;
    footerTag: HTMLSpanElement;
    mainFooter: HTMLDivElement;
    constructor(art: Art);
    getRootDomChilds(): void;
    /**打开历史工具 */
    open(): void;
    private updateDirectory;
    private restoreMdFile;
    save(): void;
    /**关闭历史工具 */
    close(): void;
}
export declare let VersionHistoryExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
