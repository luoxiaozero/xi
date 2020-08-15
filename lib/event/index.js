
class Event{
    static isComposition = false;
    static cursorLocation = null;
    constructor(container, rootDom) {
        this.container = container;
        this.rootDom = rootDom;
        this.onUploadImg = null;
    } 
    init(){
        this.rootDom.onkeydown = this.onkeydown         
        this.rootDom.onkeyup = this.onkeyup
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
                    console.log(html);
                    let location = window.artText.interpreter.location;
                    console.log(location);
                    window.artText.interpreter.htmlDispose(body);
                    for(let i = 0; i < body.childNodes.length; i++){
                        if(location[0] == 0 && i == 0){
                            console.log(body.childNodes[i].innerHTML);
                            window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
                        }else{
                            window.artText.event.rootDom.childNodes[location[2]].innerHTML += body.childNodes[i].innerHTML;
                        }
                    }
                })
                return false;
            }
        }
    }
    htmlDispose(html){
        let _childNodes = []
        let p = []
        for(let i = 0; i < html.childNodes.length; i++){
            if(html.childNodes[i].nodeName == 'P'){

            }else{

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
        window.artText.interpreter.onclick();
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