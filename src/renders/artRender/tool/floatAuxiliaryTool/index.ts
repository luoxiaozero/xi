import { Art } from "../../../../core";
import EventCenter from "../../../../eventCenter";
import Tool from "../../../../tool";
import ArtRender from "../..";
import createCodeBlockTool from "../codeBlockTool";

/**浮动辅助工具 */
export default class FloatAuxiliaryTool {

    dom: HTMLElement;
    uiDom: HTMLUListElement;
    copyDummy: HTMLTextAreaElement;
    artRender: ArtRender;
    constructor(artRender: ArtRender) {
        this.artRender = artRender;
        this.dom = document.createElement("div");
        this.createDom();
        this.copyDummy = document.createElement('textarea');
        this.copyDummy.setAttribute("style", "position:absolute; width:0; height:0; opacity:0;");
        this.dom.appendChild(this.copyDummy);

        this.artRender.artText.get<Tool>('$tool').add([{ dom: this.dom }]);
    }

    /**创建节点 */
    public createDom(): void {
        this.uiDom = document.createElement('ul');
        this.uiDom.style.fontSize = "14px";
        this.dom.appendChild(this.uiDom);
        this.uiDom.style.display = 'none';
        this.uiDom.setAttribute('class', 'art-floatTool');

        this.createLi('使用百度搜索', this.search);
        this.createLi("复制为Markdown", this.copyMarkdown);
        this.createDivider();

        this.createLi('剪切', this.cut);
        this.createLi('复制', this.copy);
        this.createLi('粘贴', this.paste);
    }

    /**显示浮窗 */
    public open(x: number, y: number) {
        this.uiDom.style.display = 'inherit';
        this.uiDom.style.top = y.toString() + 'px';
        this.uiDom.style.left = x.toString() + 'px';
        // this.floatAuxiliaryTool.style.left = ((<any>event).pageX).toString() + 'px'
    }

    /**隐藏浮窗 */
    public close() {
        this.uiDom.style.display = 'none';
    }

    /**创建li */
    private createDivider(): HTMLLIElement {
        let li = document.createElement('li');
        li.className = 'art-divider';
        this.uiDom.appendChild(li);
        return li;
    }

    /**创建li */
    private createLi(text: string, fun: Function): HTMLLIElement {
        let li = document.createElement('li');
        li.setAttribute('class', 'art-floatTool-li');
        li.innerText = text;
        let _this = this;
        function closure() {
            return fun(_this);
        }
        li.onmousedown = closure as any;
        this.uiDom.appendChild(li);
        return li;
    }

    /**搜索 */
    private search(_this: FloatAuxiliaryTool) {
        let text = window.getSelection().toString();
        _this.close();
        window.open("https://www.baidu.com/s?ie=UTF-8&wd=" + text);
    }
    /**复制 markdown 文本 */
    private copyMarkdown(_this: FloatAuxiliaryTool) {
        _this.close();
        _this.copyDummy.value = _this.artRender.getSelectNodeMd();
        _this.copyDummy.select();
        document.execCommand('Copy');
    }

    /**复制 */
    private copy(_this: FloatAuxiliaryTool) {
        _this.close();
        document.execCommand('Copy');
        return true;
    }

    /**剪贴 */
    private cut(_this: FloatAuxiliaryTool) {
        _this.close();
        document.execCommand('Cut');
    }

    /**贴贴 */
    private paste(_this: FloatAuxiliaryTool) {
        _this.close();
        document.execCommand('Paste');
    }
}

export let floatAuxiliaryToolExport = {
    install(Art: any, options: any) {
        options['container'].bind('floatAuxiliaryTool', FloatAuxiliaryTool, [{ 'get': '$artRender' }], true);
    },
    created(art: Art, options: any) {
        let floatAuxiliaryTool = art.get<FloatAuxiliaryTool>("floatAuxiliaryTool");
        art.get<EventCenter>("$eventCenter").on("floatAuxiliaryTool.open", (x: number, y: number) => { floatAuxiliaryTool.open(x, y) });
        art.get<EventCenter>("$eventCenter").on("floatAuxiliaryTool.close", () => { floatAuxiliaryTool.close() });
    }
}