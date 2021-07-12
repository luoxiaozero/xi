import ArtText from '../artText';
import './index.css';
/**工具类, 存放基本库 */
export default class Tool {
    /**加载js文件 */
    static loadScript(url: string, callback: Function): void;
    /**加载css文件 */
    static loadCss(url: string): void;
    /**添加css文本 */
    static addCss(css: string): boolean;
    /**判断dom是否存在cls类 */
    static hasClass(element: HTMLElement, cls: string): boolean;
    /**
     * 插入参考节点之后
     * @param node 父节点
     * @param newChild 新的节点
     * @param refChild 参考节点
     */
    static insertAfter(node: HTMLElement, newChild: HTMLElement, refChild: HTMLElement): void;
    artText: ArtText;
    constructor(artText: ArtText);
    /**
     * 添加需要绑定到artText.dom上的节点
     * @param domInfos 节点或节点们的信息
     */
    add(domInfos: [] | any): void;
    /**
     * 添加到artText.dom节点
     * @param dom 节点
     * @param place 添加的位置
     */
    private insertDom;
}
export declare let ToolExport: {
    install: (Art: any, options: any) => void;
    created: (art: any, options: any) => void;
};
