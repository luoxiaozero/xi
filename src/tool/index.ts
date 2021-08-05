import Editor from '../editor';
import ArtText from '../artText';
import './index.css'
import { Art } from '../core';

/**工具类, 存放基本库 */
export default class Tool {
    /**加载js文件 */
    static loadScript(url: string, callback: Function): void {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (typeof callback != "undefined") {
            script.onload = function () {
                callback();
            }
        };
        script.src = url;
        document.body.appendChild(script);
    }

    /**加载css文件 */
    static loadCss(url: string): void {
        var head = document.getElementsByTagName('head')[0];

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        head.appendChild(link);
    }

    /**添加css文本 */
    static addCss(css: string): boolean {
        if (css == null || css == '')
            return false;
        var head = document.head || document.getElementsByTagName('head')[0];

        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));

        head.appendChild(style);
        return true;
    }

    /**判断dom是否存在cls类 */
    static hasClass(element: HTMLElement, cls: string): boolean {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    /**
     * 插入参考节点之后
     * @param node 父节点
     * @param newChild 新的节点
     * @param refChild 参考节点
     */
    static insertAfter(node: HTMLElement, newChild: HTMLElement, refChild: HTMLElement) {
        if (node.lastChild == refChild) {
            node.appendChild(newChild);
        } else {
            node.insertBefore(newChild, refChild.previousElementSibling);
        }
    }

    artText: ArtText;
    constructor(artText: ArtText) {
        this.artText = artText;
    }

    /**
     * 添加需要绑定到artText.dom上的节点
     * @param domInfos 节点或节点们的信息
     */
    public add(domInfos: [] | any) {
        if (Array.isArray(domInfos)) {
            for (let domInfo of domInfos) {
                let { dom, place } = domInfo;
                this.insertDom(dom, place);
            }
        } else {
            let { dom, place } = domInfos;
            this.insertDom(dom, place);
        }
    }

    /**
     * 添加到artText.dom节点
     * @param dom 节点
     * @param place 添加的位置 
     */
    private insertDom(dom: HTMLElement, place: string) {
        switch (place) {
            case 'Content.before':
            case 'Editor.before':
                this.artText.dom.insertBefore(dom, this.artText.domContent);
                // this.artText.dom.insertBefore(dom, this.artText.get<Editor>('$editor').dom);
                break;
            case 'Content.after':
            case 'Editor.after':
                Tool.insertAfter(this.artText.dom, dom, this.artText.domContent);
                // Tool.insertAfter(this.artText.dom, dom, this.artText.get<Editor>('$editor').dom);
                break;
            case 'Content.start':
                const domContent = this.artText.domContent;
                if (domContent.childNodes.length === 0) {
                    domContent.appendChild(dom);
                } else {
                    domContent.insertBefore(dom, domContent.childNodes[0]);
                }
                break;
            case 'Content.in':
                this.artText.domContent.appendChild(dom);
                break;
            default:
                this.artText.dom.appendChild(dom);
                break;
        }
    }
}

export let ToolExport = {
    install: function (Art: any, options: any) {
        options['container'].bind('$tool', Tool, [{'get': 'art'}], true);
    },
    created: function (art: Art , options: any) {
        art.get('$tool');
    }
}