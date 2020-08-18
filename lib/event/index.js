
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
                    console.log(body.childNodes);
                    let location = window.artText.interpreter.location;
                    console.log(location);
                    let mdHtml = window.artText.event.htmlDispose(body);
                    console.log(mdHtml.innerHTML);
                    body = mdHtml;
                    let sub = location[2];
                    console.log(body.childNodes.length);
                    var i;
                    let length = body.childNodes.length;
                    for(i = 0; i < length; i++){
                        console.log(body.childNodes[i]);
                        console.log(body.childNodes[i].innerHTML);
                        console.log(body.childNodes.length, 'dasd', i);
                        if(i == 0){
                            console.log(sub);
                            for(let j = 0; j < body.childNodes[0].childNodes.length; j++){
                                window.artText.event.rootDom.childNodes[sub].appendChild(body.childNodes[0].childNodes[j]);
                            }
                            sub++;
                            //window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
                        }else{
                            console.log(sub);
                            window.artText.event.rootDom.insertBefore(body.childNodes[i], window.artText.event.rootDom.childNodes[sub]);
                            sub++;
                        }
                    }
                    console.log(i, 'dad---i')
                })   
                return false;
            }
        }
    }
    htmlDispose(html){
        let _childNodes = []
        let p = []
        if(html.nodeName == 'BODY'){
            let body = document.createElement('body');
            for(let i = 0; i < html.childNodes.length; i++){
                if(html.childNodes[i].nodeName == 'DIV' || html.childNodes[i].nodeName == 'P'){
                    console.log('p-div');
                    let dom = this.htmlDispose(html.childNodes[i]);
                    body.appendChild(dom);
                }
            }
            if(body.childNodes.length == 1 && body.childNodes[0].childNodes.length > 0 && 
                body.childNodes[0].childNodes[0].nodeName == 'P'){
                let body2 = document.createElement('body');
                for(let i = 0; i < body.childNodes[0].childNodes.length; i++){
                    body2.appendChild(body.childNodes[0].childNodes[i]);
                }
                body = body2;
            }
            console.log(body);
            return body;
        }else if(html.nodeName == 'DIV' || html.nodeName == 'P'){
            let p = document.createElement('p');
            let temp = null;
            console.log('div p');
            for(let i = 0; i < html.childNodes.length; i++){
                if(html.childNodes[i].nodeName == 'DIV' || html.childNodes[i].nodeName == 'P'){
                    let dom = this.htmlDispose(html.childNodes[i]);
                    for(let j = 0; j < dom.childNodes.length; j++){
                        p.appendChild(dom.childNodes[j]);
                    }
                    temp = null;
                }else{
                    console.log('div p - text')
                    if(temp){
                        let dom = this.htmlDispose(html.childNodes[i]);
                        if(dom.nodeName == '#text'){
                            temp.data += dom.data;
                        }
                    }else{
                        console.log('div p - new text')
                        let dom = this.htmlDispose(html.childNodes[i]);
                        console.log(dom);
                        if(dom.nodeName == '#text'){
                            let p2 = document.createElement('p');
                            temp = document.createTextNode(dom.data);
                            p2.appendChild(temp);
                            p.appendChild(p2);
                        }
                        
                    }
                }
            }
            return p;
        }else if(html.nodeName == '#text'){
            return html;
        }else{
            let temp = null;
            for(let i = 0; i < html.childNodes.length; i++){
                if(temp){
                    let dom = this.htmlDispose(html.childNodes[i]);
                    if(dom.nodeName == '#text'){
                        temp.data += dom.data;
                    }
                }else{
                    let dom = this.htmlDispose(html.childNodes[i]);
                    console.log(dom);
                    if(dom && dom.nodeName == '#text'){
                        temp = document.createTextNode(dom.data);
                    }
                    
                }
            }
            return temp;
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