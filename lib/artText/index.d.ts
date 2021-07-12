import { ArtOptions } from '../config';
import { Art, Core } from '../core';
/** 入口类 */
export default class ArtText extends Art {
    static readonly version: string;
    static use: typeof Core.use;
    /**绑定的根节点 */
    rootContainer: HTMLElement;
    /**artText的根节点 */
    dom: HTMLDivElement;
    /**artText的名字 */
    nameId: string;
    /**artText的初始选项 */
    options: ArtOptions;
    constructor(options?: ArtOptions);
    /**
     * 挂载节点
     * @param rootContainer 节点的id属性
     */
    mount(rootId: string): ArtText;
    /**
     * 外抛API
     * @param key
     * @param event
     */
    exportAPI(key: string, event: Function): void;
    /** 卸载 */
    unmount(): void;
}
export declare let ArtTextExport: {
    install: (Art: any, options: any) => void;
};
