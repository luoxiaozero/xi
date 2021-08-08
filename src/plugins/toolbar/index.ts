import ArtText from "../../artText";
import { Art, Core } from "../../core";
import Tool from "../../tool";
import { exportMdFile, GithubExport, importMdFile, newMdFileExport, saveMdFile, switchRenderButtonExport } from "./default";
import "./styles/index.css";

/**
 * 任务栏
 */
export default class Toolbar {
    artText: ArtText;
    dom: HTMLDivElement;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-toolbar');
        const logo = document.createElement("span");
        logo.setAttribute('class', 'art-toolbar__logo');
        logo.innerText = "ArtText";
        this.dom.appendChild(logo);

        this.artText.get<Tool>('$tool').add([{ dom: this.dom, place: 'Editor.before' }]);
        for (let t of this.artText.options.toolbar) {
            this.add(t);
        }
    }

    /**
     * 添加按钮
     * @param child 按钮  
     * @deprecated 使用 addButton 方法
     */
    public add(child: any): HTMLSpanElement {
        if (child.level == undefined) {
            child.level = 0;
        }
        return this.addBotton(child.title, () => child.click(), child.level);
    }

    /**
     * 添加按钮
     * @param dom 添加的 DOM
     * @param onClick 点击事件
     * @returns 生成的 DOM
     */
    public addButton(dom: HTMLElement | string, onClick: Function, tip?: string): HTMLSpanElement {
        let span = document.createElement('span');
        span.setAttribute('class', 'art-toolbar-item')
        span.title = tip;
        if (typeof dom === "string") {
            span.innerHTML =  dom;
        } else {
            span.appendChild(dom);
        }
        span.addEventListener('click', <EventListenerOrEventListenerObject>onClick);
        this.dom.appendChild(span);

        return span;
    }

    /**
     * 添加按钮
     * @param title 按钮标题
     * @param event 按钮事件
     * @param level 按钮级别
     */
    private addBotton(title: string, event: Function, level: number = 0): HTMLSpanElement {
        let span = document.createElement('div');
        span.setAttribute('class', 'art-toolbar-item')
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        this.dom.appendChild(span);

        return span;
    }
}

export let ToolbarExport = {
    install: function (Art, options) {
        Core.use(switchRenderButtonExport);
        Core.use(newMdFileExport);
        Core.use(saveMdFile);
        Core.use(GithubExport);
        Core.use(importMdFile);
        Core.use(exportMdFile);
        
        
        options['container'].bind('toolbar', Toolbar, [{'get': 'art'}], true);
    },
    created: function (art: Art , options) {
        art.get<Toolbar>('toolbar');
    }
}