import ArtText from '../artText';
export default class EventCenter {
    artText: ArtText;
    listeners: {};
    events: Map<string, {
        target: HTMLElement;
        type: string;
        listener: Function;
        options: {};
    }>;
    waitEvents: Map<string, any[]>;
    domID: number;
    constructor(artText: ArtText);
    /**
     * art-event DOM事件执行方法
     * @param e
     */
    private artEvent;
    /**
     * 获取添加DOM事件的Id
     */
    private get eventId();
    /**
     * 添加DOM事件
     */
    attachDOMEvent(target: HTMLElement, type: string, listener: Function, options?: boolean): string;
    /**移除DOM事件 */
    detachDOMEvent(eventId: string): boolean;
    /**移除所有DOM事件 */
    detachAllDomEvent(): void;
    /**判断该DOM事件是否存在 */
    private checkHasBind;
    /**订阅器 */
    private subscribe;
    /**添加事件 */
    on(type: string, listener: Function): void;
    /**添加执行一次的事件 */
    once(type: string, listener: Function): void;
    /**提交事件 */
    emit(type: string, ...data: any[]): boolean;
    /**提交等待事件 */
    waitOnceEmit(type: string, ...data: any[]): void;
    /**移除事件 */
    off(type: string, listener: Function): void;
}
export declare let EventCenterExport: {
    install: (Art: any, options: any) => void;
    created: (art: any, options: any) => void;
};
