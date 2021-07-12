import { Art } from '../core';
import Render from '../renders';
import ArtText from '../artText';
import './index.css';
/**
 * 编辑器
 */
export default class Editor {
    artText: ArtText;
    dom: HTMLDivElement;
    fileInfo: {};
    defaultRender: any;
    runRender: Render;
    renders: {};
    constructor(artText: ArtText);
    init(): void;
    /**
     * 添加渲染器
     */
    addRender(name: string, render: Render): void;
    /**
     * 打开文件
     * @param md markdown文本
     * @param fileInfo
     * @param renderName
     */
    openFile(fileInfo?: {}, renderName?: string): void;
    /**
     * 获取文件
     * @param key
     */
    getFile(key?: string): any;
    /**
     * 切换渲染器
     * @param renderName 渲染器的名字
     */
    switchRender(renderName: string): void;
}
export declare let EditorExport: {
    install: (Art: any, options: any) => void;
    created: (art: any, options: any) => void;
    mount: (art: Art, options: any) => void;
};
