import ArtText from "../../artText";
import { Art, Core } from "../../core";
import Tool from "../../tool";
import { exportMdFile, GithubExport, importMdFile, newMdFileExport, switchRenderButtonExport } from "./default";
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
        this.dom.setAttribute('class', 'art-toolbar-min');

        this.artText.get<Tool>('$tool').add([{ dom: this.dom, place: 'Editor.before' }]);
        for (let t of this.artText.options.toolbar) {
            this.add(t);
        }
    }

    /**
     * 添加按钮
     * @param child 按钮  
     */
    public add(child: any): HTMLSpanElement {
        if (child.level == undefined) {
            child.level = 0;
        }
        return this.addBotton(child.title, () => child.click(), child.level);
    }

    /**
     * 添加按钮
     * @param title 按钮标题
     * @param event 按钮事件
     * @param level 按钮级别
     */
    private addBotton(title: string, event: Function, level: number = 0): HTMLSpanElement {
        let span = document.createElement('div');
        span.setAttribute('class', 'art-toolbar-min-div')
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
        Core.use(importMdFile);
        Core.use(exportMdFile);
        Core.use(GithubExport);
        
        options['container'].bind('toolbar', Toolbar, [{'get': 'art'}], true);
        // options['Tool'].addCss('.art-toolbar-min{width:80px;position: fixed;margin-left: 815px;font-weight:800;font-size:13.5px;text-align: center;background-color: #fff;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 3px;padding: 3px 0;color: #666;}.art-toolbar-min-div{padding:7px 16px;cursor:pointer;} .art-toolbar-min-div:hover{background-color: #f2f2f2;color: #1abc9c;}')
    },
    created: function (art: Art , options) {
        art.get<Toolbar>('toolbar');
    }
}