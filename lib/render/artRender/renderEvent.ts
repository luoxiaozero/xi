import ArtText from "lib";
import { htmlToMd } from "lib/render/artRender/toNode";
import Tool from "lib/tool";
import { blod, del, ins, italic, mark, sub, sup } from "lib/tool/default";
import ArtRender from ".";

export default class ArtRenderEvent{
    artRender: ArtRender;
    isComposition: boolean;
    uploadImg: Function;
    constructor(artRender: ArtRender){
        this.artRender = artRender;
        this.isComposition = false;
    }

    init(): void {
        const artRenderEvent = this;
        this.artRender.artText.eventCenter.on('MoreTableTool.open', detail => this.eventOpenMore(detail, artRenderEvent));

        this.addEvent('keydown', this.keydown);
        this.addEvent('keyup', this.keyup);

        // this.onfocus      
        // this.onblur


        this.addEvent('compositionstart', (e: CompositionEvent, _this: ArtRenderEvent) => { e; _this.isComposition = true; });
        this.addEvent('compositionend', (e: CompositionEvent, _this: ArtRenderEvent) => { e; _this.isComposition = false; });

        this.addEvent('click', this.click);
        this.addEvent('contextmenu', this.contextmenu);

        const eventCenter = this.artRender.artText.eventCenter;
        this.artRender.artText.eventCenter.attachDOMEvent(document.body, 'mousewheel', e => eventCenter.emit('DOM-' + e.type));

        // 贴贴事件
        this.addEvent('paste', this.paste);

        // 拖拽事件
        this.addEvent('drop', this.drop);
        // this.ondrag

    }

    private addEvent(type: string, fun: Function): void {
        const _this = this;
        function closure(e) {
            _this.artRender.artText.eventCenter.emit('DOM-' + e.type);
            fun(e, _this);
        }

        this.artRender.artText.eventCenter.attachDOMEvent(this.artRender.dom, type, closure);
    }

    private eventOpenMore(detail: {}, artRenderEvent: ArtRenderEvent) {
        artRenderEvent.artRender.tableMoreTool.open(detail['xy'], detail['table']);
        return false;
    }

    public keydown(e: KeyboardEvent, _this: ArtRenderEvent): boolean {
        let key: string = e.key;
        if (!_this.shortcutKey(e, _this.artRender.artText)) {
            // 是否摁下快捷键
            return false;
        } else if (/^Arrow(Right|Left|Up|Down)$/.test(key) && _this.artRender.cursor.moveCursor(key)) {
            e.preventDefault();
            return false;
        } else if (key == 'Enter') {
            // 回车时渲染
            if (!_this.artRender.render(key, 'keydown')) {
                e.preventDefault();
                return false;
            }
        } else if (key == 'Backspace') {
            // 退格时渲染
            if (!_this.artRender.render(key, 'keydown')) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    }

    private shortcutKey(e: KeyboardEvent, artText: ArtText): boolean {
        if (e.ctrlKey && e.keyCode == 66) {
            // ctrl + b 粗体
            blod(artText);
        } else if (e.ctrlKey && e.keyCode == 73) {
            // ctrl + i 斜体
            italic(artText);
        } else if (e.ctrlKey && e.shiftKey && e.keyCode == 68) {
            // ctrl + shift + d 删除线
            del(artText);
        } else if (e.ctrlKey && e.keyCode == 85) {
            // ctrl + u 下划线
            ins(artText);
        } else if (e.ctrlKey && e.altKey && e.keyCode == 83) {
            // ctrl + alt + s 上标
            sup(artText);
        } else if (e.ctrlKey && e.shiftKey && e.keyCode == 83) {
            // ctrl + shift + s 下标
            sub(artText);
        } else if (e.ctrlKey && e.keyCode == 77) {
            // ctrl + m 标记
            mark(artText);
        } else {
            return true;
        }
        return false;
    }

    private keyup(e: KeyboardEvent, _this: ArtRenderEvent) {
        let key: string = e.key;

        if (key == 'Backspace') {
            if (_this.artRender.dom.innerHTML == '') {
                // html编辑器为空时
                _this.artRender.dom.innerHTML = '<p><br/></p>';
            }
        }
        if (!_this.isComposition) {
            // 输入法不为连续时，如中文输入时
            _this.artRender.render(key, 'keyup');
        }
    }

    /**左点击 */
    private click(e: MouseEvent, _this: ArtRenderEvent) {
        let dom = e.target as HTMLAnchorElement;
        if (e.altKey && dom.nodeName == "A") {
            //window.location.href=node.href;
            window.open(dom.href)
        } else {
            let cursor = _this.artRender.cursor;
            cursor.getSelection();
            cursor.setSelection();
        }
    }

    /**右点击 */
    private contextmenu(e: MouseEvent, _this: ArtRenderEvent) {
        e.preventDefault();
        _this.artRender.floatAuxiliaryTool.open(e.clientY, e.clientX);
    }

    private paste(e: ClipboardEvent, _this: ArtRenderEvent) {
        if (!(e.clipboardData && e.clipboardData.items)) {
            return;
        }
        let clipboard = null;
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            let item = e.clipboardData.items[i];
            if (item.kind === "string") {
                if (item.type == "text/plain") {
                    clipboard = ["text/plain", item];
                } else if (item.type == "text/html") {
                    clipboard = ["text/html", item];
                    break;
                }
            }
        }
        if (clipboard) {
            if (clipboard[0] == "text/html") {
                let fun: Function = _this.getAsString(_this.artRender);
                clipboard[1].getAsString(fun);
                return false;
            }
        }
    }

    private getAsString(_this: ArtRender): Function {
        // 剪贴事件回调
        function closure(str: string) {
            let html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = str;
            let body = html.childNodes[1];

            let location = _this.cursor.location;
            console.log(location);
            let md = htmlToMd(body);
            console.log(md);
            md = md.replace(/(^\s*)|(\s*$)/g, "");
            let mdRows = md.split('\n');
            let sub = location[2];
            for (let i = 0; i < mdRows.length; i++) {
                if (i == 0) {
                    console.log(sub);
                    _this.dom.childNodes[sub].appendChild(document.createTextNode(mdRows[i]));
                    sub++;
                    //window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
                } else {
                    console.log(sub);
                    _this.dom.insertBefore(document.createTextNode(mdRows[i]), _this.dom.childNodes[sub]);
                    sub++;
                }
            }
        }
        return closure;

    }

    private drop(e: DragEvent, _this: ArtRenderEvent) {
        e.preventDefault();
        for (var i = 0, len = e.dataTransfer.files.length; i < len; i++) {
            var f0 = e.dataTransfer.files[i];
            //创建一个文件内容读取器——FileReader
            var fr = new FileReader();
            console.log(fr, f0);
            if (/.*\.md$/.test(f0.name) || f0.type == 'text/plain') {
                fr.onload = function () {
                    if (fr.result) {
                        _this.artRender.artText.editor.openFile(fr.result.toString(), f0.name);
                    }
                };
                fr.readAsText(f0);
            } else if (/^image\/(png|jpe?g)$/.test(f0.type)) {
                fr.onload = function () {
                    let url = null;
                    if (_this.uploadImg) {
                        url = _this.uploadImg(fr.result);
                    } else {
                        url = fr.result;
                    }

                    var img = new Image();
                    img.src = url; //dataURL
                    console.log(img);
                    let span = document.createElement('span');
                    span.setAttribute('class', 'art-hide');
                    let text = document.createTextNode('![' + f0.name + '](' + url + ')');
                    span.appendChild(text);
                    const target = e.target as HTMLElement;
                    target.appendChild(span);
                    target.appendChild(img);
                }
                //读取文件中的内容 —— DataURL：一种特殊的URL地址，本身包含着所有的数据
                fr.readAsDataURL(f0);
            } else {
                Tool.message('不支持该文件类型', 'error');
            }
        }
    }
}