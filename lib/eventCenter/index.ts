import {htmlToMd} from "../editor/toNode/index"
import ArtText from "../index";
import {blod, italic, del, ins, sup, sub, mark} from "../tool/default";

class EventCenter{

    editorHtmlDom: HTMLDivElement;
    uploadImg: Function;
    clickInfo: Map<string, number>;
    artText: ArtText;
    isComposition: boolean;

    constructor(artText: ArtText, editorHtmlDom: HTMLDivElement){
        this.artText = artText;
        this.editorHtmlDom = editorHtmlDom;
        this.uploadImg = null;
        this.clickInfo = null;
        this.isComposition = false;
    } 
    
    init(): void{
        this.addEventListener('keydown', this.keydown);
        this.addEventListener('keyup', this.keyup);      

        // this.onfocus      
        // this.onblur
          
        this.addEventListener('compositionstart', (e: CompositionEvent, _this: EventCenter) =>{e;_this.isComposition = true;});
        this.addEventListener('compositionend', (e: CompositionEvent, _this: EventCenter) =>{e;_this.isComposition = false;});
        
        this.addEventListener('click', this.click);
        this.addEventListener('contextmenu', this.contextmenu);  
        this.addEventListener('mousedown', this.mousedown)

        // 贴贴事件
        this.addEventListener('paste', this.paste);  

        // 拖拽事件
        this.addEventListener('drop', this.drop)
        // this.ondrag
    }

    addEventListener(eventName: string, fun: Function, useCapture: boolean=false): void{
        let _this = this;
        function closure(e){
            fun(e, _this);
        }
        this.editorHtmlDom.addEventListener(eventName, closure, useCapture);
    }

    removeEventListener(eventName: string, fun: EventListenerOrEventListenerObject, useCapture: boolean=false): void{
        this.editorHtmlDom.removeEventListener(eventName, fun, useCapture);
    }

    keydown(e: KeyboardEvent, _this: EventCenter): boolean{
        let keyCode: number = e.keyCode;
        if(!_this.shortcutKey(e, _this.artText)){
            return false;
        }
        if(keyCode == 13){
            // 回车时渲染
            if(!_this.artText.editor.enterRender()){
                e.preventDefault();
                return false;
            }
        }
        return true;
    }

    shortcutKey(e: KeyboardEvent, artText: ArtText): boolean{
        if(e.ctrlKey && e.keyCode == 66){
            // ctrl + b 粗体
            blod(artText);
        } else if(e.ctrlKey && e.keyCode == 73){
            // ctrl + i 斜体
            italic(artText);
        } else if(e.ctrlKey && e.shiftKey && e.keyCode == 68){
            // ctrl + shift + d 删除线
            del(artText);
        } else if(e.ctrlKey && e.keyCode == 85){
            // ctrl + u 下划线
            ins(artText);
        } else if(e.ctrlKey && e.altKey && e.keyCode == 83){
            // ctrl + alt + s 上标
            sup(artText);
        } else if(e.ctrlKey && e.shiftKey && e.keyCode == 83){
            // ctrl + shift + s 下标
            sub(artText);
        } else if(e.ctrlKey  && e.keyCode == 77){
            // ctrl + m 标记
            mark(artText);
        }else{
            return true;   
        }
        return false;       
    }

    keyup(e: KeyboardEvent, _this: EventCenter){
        let keyCode = e.keyCode;
        if(keyCode == 8){
            if(_this.editorHtmlDom.innerHTML == ""){
                // html编辑器为空时
                _this.editorHtmlDom.innerHTML =  "<div><p><br/></p></div>"
            }
        }
        if(!_this.isComposition){
            // 输入法不为连续时，如中文输入时
            _this.artText.editor.render();
        }
    }

    click(e: MouseEvent, _this: EventCenter){
        let dom = e.target as HTMLAnchorElement;
        if(e.altKey && dom.nodeName == "A"){
            //window.location.href=node.href;
            window.open(dom.href)
        }else{
            _this.artText.editor.click('left');
        }
    }

    contextmenu(e: MouseEvent, _this: EventCenter){
        e.preventDefault();
        _this.artText.editor.click('right');
    }

    mousedown(e: MouseEvent, _this: EventCenter){
        let obj: Map<string, number> = new Map();
        obj['pageX'] = e.pageX;
        obj['pageY'] = e.pageY;
        obj['offsetX'] = e.offsetX;
        obj['offsetY'] = e.offsetY;
        _this.clickInfo = obj;;
    }

    paste(e: ClipboardEvent,  _this: EventCenter){
        if ( !(e.clipboardData && e.clipboardData.items) ) {
            return;
        }
        let clipboard = null;
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            let item = e.clipboardData.items[i];
            if (item.kind === "string") {
                if(item.type == "text/plain"){
                    clipboard = ["text/plain", item];
                }else if(item.type == "text/html"){
                    clipboard = ["text/html", item];
                    break;
                }
            }
        }
        if(clipboard){
            if(clipboard[0] == "text/html"){
                let fun: Function = _this.getAsString(_this);
                clipboard[1].getAsString(fun);
                return false;
            }
        }
    }
    getAsString(_this: EventCenter): Function{
        // 剪贴事件回调
        function closure(str: string){
            let html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = str;    
            let body = html.childNodes[1];

            let location = _this.artText.editor.cursor.location;
            console.log(location);
            let md = htmlToMd(body);
            console.log(md);
            md = md.replace(/(^\s*)|(\s*$)/g, "");
            let mdRows = md.split('\n');
            let sub = location[2];
            for(let i = 0; i < mdRows.length; i++){
                if(i == 0){
                console.log(sub);
                _this.editorHtmlDom.childNodes[sub].appendChild(document.createTextNode(mdRows[i]));
                sub++;
                //window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
            }else{
                console.log(sub);
                _this.editorHtmlDom.insertBefore(document.createTextNode(mdRows[i]), _this.editorHtmlDom.childNodes[sub]);
                sub++;
            }
        }
        }
        return closure;
        
    }
    
    drop(e: DragEvent, _this: EventCenter)
    {
        e.preventDefault();
        for (var i = 0, len = e.dataTransfer.files.length; i < len; i++) {
            var f0 = e.dataTransfer.files[i];
            //创建一个文件内容读取器——FileReader
            var fr = new FileReader();
            //读取文件中的内容 —— DataURL：一种特殊的URL地址，本身包含着所有的数据
            fr.readAsDataURL(f0);
            fr.onload = function(){
                console.log('文件中的数据读取完成')
                let url = null;
                if(_this.uploadImg){
                    url = _this.uploadImg(fr.result);
                }else{
                    url = fr.result;
                }
                console.log(url);

                var img = new Image();
                img.src = url; //dataURL
                console.log(img);
                let span = document.createElement('span');
                span.setAttribute('class', 'art-hide');
                let text = document.createTextNode('!['+ f0.name + ']('+ url +')');
                span.appendChild(text);
                const target = e.target as HTMLElement;
                target.appendChild(span);
                target.appendChild(img);
            } 
        }
    }
}
export default EventCenter