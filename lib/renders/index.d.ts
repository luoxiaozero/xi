/**渲染器接口 */
export default interface Render {
    /**渲染器缩写名字 */
    abbrName: string;
    /**创建渲染器的根节点 */
    createDom: () => HTMLElement;
    /**打开渲染器 */
    open: () => void;
    /**关闭渲染器 */
    close: () => void;
    /**获取markdow文本 */
    getMd: () => string;
    /**
     * 设置markdow文本
     * @param md markdown文本
     */
    setMd: (md: string) => void;
    /**添加所有事件 */
    attachAllEvent: () => void;
    /**移除所有事件 */
    detachAllEvent: () => void;
}
