/**浮动辅助工具 */
export default class FloatAuxiliaryTool {

    dom: HTMLUListElement;
    constructor() {
        this.dom = document.createElement('ul');
        this.dom.style.display = 'none';
        this.dom.setAttribute('class', 'art-floatTool');
    }

    /**
     * 创建根节点
     */
    public createDom(): HTMLUListElement {
        this.createLi('使用百度搜索', this.search);

        let li = document.createElement('li');
        li.className = 'art-divider';
        this.dom.appendChild(li);

        this.createLi('剪切', this.cut);
        this.createLi('复制', this.copy);
        this.createLi('粘贴', this.paste);

        return this.dom;
    }

    /**显示浮窗 */
    public open(x: number, y: number) {
        this.dom.style.display = 'inherit';
        this.dom.style.top = x.toString() + 'px';
        this.dom.style.left = y.toString() + 'px';
        // this.floatAuxiliaryTool.style.left = ((<any>event).pageX).toString() + 'px'
    }

    /**隐藏浮窗 */
    public close() {
        this.dom.style.display = 'none';
    }

    /**创建li */
    private createLi(text: string, fun: Function): HTMLLIElement {
        let li = document.createElement('li');
        li.setAttribute('class', 'art-floatTool-li');
        li.innerText = text;
        let _this = this;
        function closure() {
            fun(_this);
        }
        li.onmousedown = closure as any;
        this.dom.appendChild(li);
        return li;
    }

    /**搜索 */
    private search(_this: FloatAuxiliaryTool) {
        let text = window.getSelection().toString();
        _this.dom.style.display = 'none';
        window.open("https://www.baidu.com/s?ie=UTF-8&wd=" + text);
    }

    /**复制 */
    private copy(_this: FloatAuxiliaryTool) {
        _this.dom.style.display = 'none';
        document.execCommand('Copy');
        return true;
    }

    /**剪贴 */
    private cut(_this: FloatAuxiliaryTool) {
        _this.dom.style.display = 'none';
        document.execCommand('Cut');
    }

    /**贴贴 */
    private paste(_this: FloatAuxiliaryTool) {
        _this.dom.style.display = 'none';
        document.execCommand('Paste');
    }
}

