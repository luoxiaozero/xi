import ArtText from "../../artText";
import { Art } from "../../core";
/**
 * 任务栏
 */
export default class Toolbar {
    artText: ArtText;
    dom: HTMLDivElement;
    constructor(artText: ArtText);
    /**
     * 添加按钮
     * @param child 按钮
     */
    add(child: any): HTMLSpanElement;
    /**
     * 添加按钮
     * @param title 按钮标题
     * @param event 按钮事件
     * @param level 按钮级别
     */
    private addBotton;
}
export declare let ToolbarExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
