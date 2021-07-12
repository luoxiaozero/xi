import { Art } from "../../../../core";
import ArtRender from "../..";
/**浮动辅助工具 */
export default class FloatAuxiliaryTool {
    dom: HTMLElement;
    uiDom: HTMLUListElement;
    copyDummy: HTMLTextAreaElement;
    artRender: ArtRender;
    constructor(artRender: ArtRender);
    /**创建节点 */
    createDom(): void;
    /**显示浮窗 */
    open(x: number, y: number): void;
    /**隐藏浮窗 */
    close(): void;
    /**创建li */
    private createDivider;
    /**创建li */
    private createLi;
    /**搜索 */
    private search;
    /**复制 markdown 文本 */
    private copyMarkdown;
    /**复制 */
    private copy;
    /**剪贴 */
    private cut;
    /**贴贴 */
    private paste;
}
export declare let floatAuxiliaryToolExport: {
    install(Art: any, options: any): void;
    created(art: Art, options: any): void;
};
