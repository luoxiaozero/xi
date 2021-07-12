import ArtRender from '..';
/**
 * 渲染器的事件类
 */
export default class ArtRenderEvent {
    artRender: ArtRender;
    /**是否连续输入，如中文输入时，多个摁键代表一个中文 */
    isComposition: boolean;
    DOMEvents: string[];
    customizeEvents: [string, Function][];
    constructor(artRender: ArtRender);
    /**添加所有事件 */
    attachAllEvent(): void;
    /**移除所有事件 */
    detachAllEvent(): void;
    /**添加dom事件 */
    private addDOMEvent;
    /**添加自定义事件 */
    addCustomizeEvent(type: string, listener: Function): void;
    /**摁键摁下行为 */
    keydown(e: KeyboardEvent, _this: ArtRenderEvent): boolean;
    private shortcutKey;
    /**摁键抬起行为 */
    private keyup;
    /**左点击 */
    private click;
    /**右点击 */
    private contextmenu;
    /**复制 */
    private copy;
    /**贴贴行为 */
    private paste;
    /**剪贴 */
    private cut;
    /**
     * 拖事件
     */
    private drop;
}
