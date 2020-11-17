import ArtText from '@/artText';
import { blod, del, ins, italic, mark, sub, sup } from '../tool/default';
import ArtRender from '..';
import { domToMd } from '../artRenderRender/grammer';

/**
 * 渲染器的事件类
 */
export default class ArtRenderEvent {

    artRender: ArtRender;
    /**是否连续输入，如中文输入时，多个摁键代表一个中文 */
    isComposition: boolean = false;
    uploadImg: Function;
    DOMEvents: string[] = [];
    customizeEvents: [string, Function][] = [];
    constructor(artRender: ArtRender) {
        this.artRender = artRender;
    }

    /**添加所有事件 */
    public attachAllEvent() {
        this.artRender.dom.setAttribute('contenteditable', 'true');

        const artRenderEvent = this;
        this.addCustomizeEvent('MoreTableTool.open', detail => {
            artRenderEvent.artRender.tableMoreTool.open(detail['xy'], detail['table']);
            return false;
        })
        this.addCustomizeEvent('DOM.click', () => { artRenderEvent.artRender.floatAuxiliaryTool.close(); artRenderEvent.artRender.tableMoreTool.close() })
        this.addCustomizeEvent('DOM.mousewheel', () => { artRenderEvent.artRender.floatAuxiliaryTool.close(); artRenderEvent.artRender.tableMoreTool.close() });

        this.addDOMEvent('keydown', this.keydown);
        this.addDOMEvent('keyup', this.keyup);

        // 连续输开始
        this.addDOMEvent('compositionstart', (e: CompositionEvent, _this: ArtRenderEvent) => _this.isComposition = true);
        // 连续输结束
        this.addDOMEvent('compositionend', (e: CompositionEvent, _this: ArtRenderEvent) =>  _this.isComposition = false);

        this.addDOMEvent('click', this.click);
        this.addDOMEvent('contextmenu', this.contextmenu);

        const eventCenter = this.artRender.artText.$eventCenter;
        this.artRender.artText.$eventCenter.attachDOMEvent(document.body, 'mousewheel', e => eventCenter.emit('DOM.' + e.type));

        this.addDOMEvent('paste', this.paste);

        this.addDOMEvent('drop', this.drop);
        // this.ondrag
    }

    /**移除所有事件 */
    public detachAllEvent() {
        for (let customize of this.customizeEvents) {
            this.artRender.artText.$eventCenter.off(...customize);
        }

        for (let id of this.DOMEvents) {
            this.artRender.artText.$eventCenter.detachDOMEvent(id);
        }
        this.customizeEvents = [];
        this.DOMEvents = [];
        this.artRender.dom.setAttribute('contenteditable', 'false');
    }

    /**添加dom事件 */
    private addDOMEvent(type: string, fun: Function): void {
        const _this = this;
        function closure(e) {
            _this.artRender.artText.$eventCenter.emit('DOM.' + e.type);
            return fun(e, _this);
        }

        let id = this.artRender.artText.$eventCenter.attachDOMEvent(this.artRender.dom, type, closure);
        this.DOMEvents.push(id);
    }

    /**添加自定义事件 */
    private addCustomizeEvent(type: string, listener: Function): void {
        this.artRender.artText.$eventCenter.on(type, listener);
        this.customizeEvents.push([type, listener]);
    }

    /**摁键摁下行为 */
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
            if (!_this.artRender.renderRender.render(key, 'keydown')) {
                e.preventDefault();
                return false;
            }
        } else if (key == 'Backspace') {
            // 退格时渲染
            if (!_this.artRender.renderRender.render(key, 'keydown')) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    }

    // 快捷键
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

    /**摁键抬起行为 */
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
            _this.artRender.renderRender.render(key, 'keyup');
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

    /**贴贴行为 */
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
            let md = domToMd(body as HTMLElement);
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

    /**
     * 拖事件
     */
    private drop(e: DragEvent, _this: ArtRenderEvent) {
        e.preventDefault();
        for (let i = 0, len = e.dataTransfer.files.length; i < len; i++) {
            let f0 = e.dataTransfer.files[i];
            let fr = new FileReader();

            if (/.*\.md$/.test(f0.name) || f0.type == 'text/plain') {
                // 加载文本
                fr.onload = () => {
                    if (fr.result) {
                        _this.artRender.artText.$editor.openFile({ defaultMd: fr.result.toString(), name: f0.name });
                    }
                };
                fr.readAsText(f0);
            } else if (/^image\/(png|jpe?g)$/.test(f0.type)) {
                // 加载图片
                fr.onload = function () {
                    let url = null;
                    if (_this.uploadImg) {
                        url = _this.uploadImg(fr.result);
                    } else {
                        url = fr.result;
                    }

                    let img = new Image();
                    img.src = url;

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
                _this.artRender.artText.$pluginCenter.emit('Message', '不支持该文件类型', 'error');
            }
        }
    }
}