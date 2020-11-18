import ArtText from '../artText';

export default class EventCenter {

    artText: ArtText;
    listeners: {};
    events: Map<string, { target: HTMLElement, type: string, listener: Function, options: {} }>;
    domID: number;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.events = new Map();
        this.listeners = {};
        this.domID = 0;
        const eventCenter = this;
        this.attachDOMEvent(this.artText.dom, 'art-event', e => eventCenter.artEvent(e));
    }

    /**
     * art-event DOM事件执行方法
     * @param e 
     */
    private artEvent(e: CustomEvent){
        this.emit(e.detail.type, e.detail);
    }
    
    /**
     * 获取添加DOM事件的Id 
     */
    private get eventId(): string {
        return `eventId-${this.domID++}`;
    }

    /**
     * 添加DOM事件 
     */
    public attachDOMEvent(target: HTMLElement, type: string, listener: Function, options: boolean = false): string {
        if (this.checkHasBind(target, type, listener, options))
            return null;
        const eventId = this.eventId;

        target.addEventListener(type, listener as EventListenerOrEventListenerObject, options);
        this.events.set(eventId, { target, type, listener, options });

        return eventId;
    }

    /**移除DOM事件 */
    public detachDOMEvent(eventId: string): boolean {
        if (!eventId)
            return false;
        const removeEvent = this.events.get(eventId);
        if (removeEvent != undefined) {
            const { target, type, listener, options } = removeEvent;
            target.removeEventListener(type, listener as EventListenerOrEventListenerObject, options);
            this.events.delete(eventId);
        }
        return true;
    }

    /**移除所有DOM事件 */
    public detachAllDomEvent(): void {
        for (const eventId in this.events) {
            this.detachDOMEvent(eventId);
        }
    }

    /**判断该DOM事件是否存在 */
    private checkHasBind(cTarget: HTMLElement, cType: string, cListener: Function, cOptions: boolean = false): boolean {
        for (const key in this.events) {
            const { target, type, listener, options } = this.events[key];
            if (target === cTarget && type === cType && listener === cListener && options === cOptions) {
                return true
            }
        }
        return false
    }

    /**订阅器 */
    private subscribe(type: string, listener: Function, once: boolean = false): void {
        const listeners = this.listeners[type];
        const handler = { listener, once };
        if (listeners && Array.isArray(listeners)) {
            listeners.push(handler);
        } else {
            this.listeners[type] = [handler];
        }
    }

    /**添加事件 */
    public on(type: string, listener: Function): void {
        this.subscribe(type, listener);
    }

    /**添加执行一次的事件 */
    public once(type: string, listener: Function): void {
        this.subscribe(type, listener, true);
    }

    /**提交事件 */
    public emit(type: string, ...data): void{
        const eventListener = this.listeners[type];

        if (eventListener && Array.isArray(eventListener)) {
            eventListener.forEach(({ listener, once }) => {
                listener(...data)
                if (once) {
                    this.off(type, listener)
                }
            })
        }
    }

    /**移除事件 */
    public off(type: string, listener: Function): void  {
        let index: number;
        const listeners = this.listeners[type];
        if (Array.isArray(listeners) && -1 != (index = listeners.findIndex(l => l.listener === listener))) {
            listeners.splice(index, 1);
        }
    }
}