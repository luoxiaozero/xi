import {htmlToMd} from "../interpreter/toNode"
class Event{
    static isComposition = false;
    constructor(container, rootDom) {
        this.container = container;
        this.rootDom = rootDom;
        this.onUploadImg = null;
    } 
    init(){
        console.log(this.rootDom);
        this.rootDom.onkeydown = this.onkeydown         
        this.rootDom.onkeyup = this.onkeyup

        this.rootDom.onfocus = this.onfocus      
        this.rootDom.onblur = this.onblur
        
        this.rootDom.addEventListener('compositionstart',function(e){
            Event.isComposition=true;
        },false);
        
        this.rootDom.addEventListener('compositionend',function(e){
            Event.isComposition=false;
        },false);
        this.rootDom.onclick = this.onclick;
        // 贴贴事件
        this.rootDom.onpaste = this.onpaste;
        // 拖拽事件
        this.rootDom.ondrop = this.ondrop;
        this.rootDom.oncontextmenu = this.oncontextmenu;
        
    }
    onfocus(e){
        //console.log(event, e);
    }
    onblur(e){
        //console.log(event, e);
    }
    onpaste(e){
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
                clipboard[1].getAsString( (str) =>{
                    let html  = document.createElement('html');
                    html.innerHTML = str;
                    let body = html.childNodes[1];
                    console.log(body);
                    let location = window.artText.interpreter.location;
                    console.log(location);
                    let md = htmlToMd(body);
                    console.log(md);
                    md = md.replace(/(^\s*)|(\s*$)/g, "");
                    let mdRows = md.split('\n');
                    let sub = location[2];
                    for(let i = 0; i < mdRows.length; i++){
                        if(i == 0){
                            console.log(sub);
                            window.artText.event.rootDom.childNodes[sub].appendChild(document.createTextNode(mdRows[i]));
                            sub++;
                            //window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
                        }else{
                            console.log(sub);
                            window.artText.event.rootDom.insertBefore(document.createTextNode(mdRows[i]), window.artText.event.rootDom.childNodes[sub]);
                            sub++;
                        }
                    }
                })   
                return false;
            }
        }
    }
    ondrag(ev)
    {
	    ev.dataTransfer.setData("Text",ev.target.id);
    }
    ondrop(e)
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
                if(window.artText.event.onUploadImg){
                    url = window.artText.event.onUploadImg(fr.result);
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

                e.target.appendChild(span);
                e.target.appendChild(img);
            } 
        }
    }
    onclick(e){
        let node = e.target;
        window.artText.interpreter.onclick('left');
        if(node && e.altKey && node.nodeName == "A"){
            //window.location.href=node.href;
            window.open(node.href)
        }
    }
    oncontextmenu(e){
        e.preventDefault();
        let node = e.target;
        window.artText.interpreter.onclick('right');
        if(node && e.altKey && node.nodeName == "A"){
            //window.location.href=node.href;
            window.open(node.href)
        }
    }
    onkeydown(e){
        let keyCode = e.keyCode;
        if(keyCode == 13){
            return window.artText.interpreter.enterRender();
        }
    }
    
    onkeyup(e){
        let _this = window.artText.event;
        let keyCode = e.keyCode;
    
        if(keyCode === 8){
            if(_this.container.innerHTML === ""){
                _this.container.innerHTML =  "<div><p><br/></p></div>"
            }
        }
        if(!Event.isComposition){
            window.artText.interpreter.render();
        }
        


    }
}
export default Event