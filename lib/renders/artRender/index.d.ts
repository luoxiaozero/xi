import ArtText from '../../artText';
import Render from '../';
import Cursor from './cursor';
import ArtRenderEvent from "./artRenderEvent";
import { TableMoreTool } from "./tool/tableTool/tableMoreTool";
import './index.css';
import { Art } from '../../core';
import InteractionParser from './interaction/interactionParser';
import VNode from '../../renders/artRender/node';
import Interaction from './interaction';
import Operation from '../../renders/artRender/node/operation';
export declare class RefMap {
    refmap: Map<string, {
        destination: string;
        title: string;
    }>;
    constructor();
    setRefMap(refmap: Map<string, {
        destination: string;
        title: string;
    }>): void;
    set(key: string, value: {
        destination: string;
        title: string;
    }): Map<string, {
        destination: string;
        title: string;
    }>;
    get(key: string): {
        destination: string;
        title: string;
    };
    has(key: string): boolean;
    delete(key: string): boolean;
}
/**
 * 默认的渲染器
 */
export default class ArtRender implements Render {
    static plugins: {
        hljs: any;
        katex: any;
        flowchart: any;
        mermaid: any;
    };
    private static artRenders;
    static setPlugin(key: string, value: any): void;
    abbrName: string;
    artText: ArtText;
    dom: HTMLDivElement;
    cursor: Cursor;
    tableMoreTool: TableMoreTool;
    renderEvent: ArtRenderEvent;
    doc: VNode;
    refmap: RefMap;
    interaction: Interaction;
    parser: InteractionParser;
    operation: Operation;
    constructor(artText: ArtText);
    createDom(): HTMLDivElement;
    open(): void;
    close(): void;
    getMd(): string;
    setMd(md: string): void;
    attachAllEvent(): void;
    detachAllEvent(): void;
    /**删除选中的元素 */
    deleteSelectNode(): boolean;
    /**获取选中的元素的 markdown 文本 */
    getSelectNodeMd(): string;
}
export declare let ArtRenderExport: {
    install: (Art: any, options: any) => void;
    created: (art: Art, options: any) => void;
};
