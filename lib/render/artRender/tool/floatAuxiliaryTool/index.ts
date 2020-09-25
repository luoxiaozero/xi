export default class FloatAuxiliaryTool {
    //dom.getBoundingClientRect()
    static codeDescribe = 'Tool.appendChild';
    dom: HTMLUListElement;

    public createDom(): HTMLUListElement {
        this.dom = document.createElement('ul');
        this.dom.style.display = 'none';
        this.dom.setAttribute('class', 'art-floatTool');

        this.createLi('使用百度搜索', this.search);

        let li = document.createElement('li');
        li.className = 'art-divider';
        this.dom.appendChild(li);

        this.createLi('剪切', this.cut);
        this.createLi('复制', this.copy);
        this.createLi('粘贴', this.paste);

        return this.dom;
        /*this.dom = document.createElement('div');
        box.style.width = '200px'
        box.style.position = 'absolute';
        box.style.top = '10px';
        box.style.left = '10px';
        box.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
        box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
        box.style.border = '1px solid #d1d1d1';
        box.style.borderRadius = '2px';
        box.style.display = 'none';*/
    }

    public open(x: number, y: number){
        this.dom.style.display = 'inherit';
        this.dom.style.top = x.toString() + 'px';
        this.dom.style.left = y.toString() + 'px';
        // this.floatAuxiliaryTool.style.left = ((<any>event).pageX).toString() + 'px'
    }

    public close(){
        this.dom.style.display = 'none';
    }

    private createLi(text: string, fun: Function): HTMLLIElement {
        let li = document.createElement('li');
        li.setAttribute('class', 'art-floatTool-li');
        li.innerText = text;
        let dom = this.dom;
        function closure() {
            fun(dom);
        }
        li.onmousedown = closure as any;
        this.dom.appendChild(li);
        return li;
    }

    private search(box: HTMLDivElement) {

        let s = window.getSelection().toString();
        box.style.display = 'none';
        window.open("https://www.baidu.com/s?ie=UTF-8&wd=" + s);
    }

    private copy(e, box: HTMLDivElement) {
        e;
        box.style.display = 'none';
        document.execCommand('Copy')
        return true;
    }

    private cut(e, box: HTMLDivElement) {
        e;
        box.style.display = 'none';
        document.execCommand('Cut');
    }

    private paste(e, box: HTMLDivElement) {
        e;
        box.style.display = 'none';
        document.execCommand('Paste');
    }
}

