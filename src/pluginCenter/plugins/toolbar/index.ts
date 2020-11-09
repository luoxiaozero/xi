import { _Object_ } from "@/pluginCenter";

/**
 * 任务栏
 */
export default class Toolbar {
    static DEFAULT_CSS = '.art-toolbar{background-color: #fff;color: #666; font-weight:600; font-size:13.5px; border-radius: 4px; position: relative;box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);margin-bottom:25px;padding:13px 10px}.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}';
    static Name = 'Toolbar';

    _object_: _Object_;
    dom: HTMLDivElement;
    levelPointer: {};
    constructor(_object_: _Object_) {
        this._object_ = _object_;

        this.levelPointer = {};
        this.dom = document.createElement("div");
        this.dom.setAttribute('class', 'art-toolbar');
    }

    /**
     * 需要挂载的节点
     */
    public createDoms(): [{}] {
        return [{ dom: this.dom, place: 'Editor.before' }];
    }

    /**
     * 添加按钮
     * @param child 按钮  
     */
    public add(child: any): HTMLSpanElement {
        if (child.isDddDefaultClass == undefined) {
            child.isDddDefaultClass = true;
        }
        if (child.level == undefined) {
            child.level = 0;
        }
        return this.addTool(child.title, () => {child.click();}, child.isDddDefaultClass, child.level);
    }

    /**
     * 添加按钮
     * @param title 按钮标题
     * @param event 按钮事件
     * @param isDddDefaultClass 是否添加默认的css的class
     * @param level 按钮级别
     */
    private addTool(title: string, event: Function, isDddDefaultClass: boolean = true, level: number = 0): HTMLSpanElement {
        let span = document.createElement('span');
        if (isDddDefaultClass)
            span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        if (this.levelPointer[level] != undefined) {
            this.dom.insertBefore(span, this.levelPointer[level]);
            this.levelPointer[level] = span;
        } else {
            let newLevel = level;
            while (level > 0 && this.levelPointer[--level] == undefined) {

            }
            if (level == 0 && this.levelPointer[level] == undefined)
                this.dom.appendChild(span);
            else
                this.dom.insertBefore(span, this.levelPointer[level]);
            this.levelPointer[newLevel] = span;
        }

        return span;
    }
}