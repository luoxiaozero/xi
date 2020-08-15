import {addCss} from '../index'
class HeadTool{
    constructor(container){
        this.container = container;
        this.dialog = null;
        this.toolbar = null;
    }
    init(){
        this.toolbar = document.createElement("div"); 
        this.toolbar.style.marginBottom = '9px';
        this.toolbar.style.padding = '4px 2px';
        this.toolbar.style.width = "100%"
        this.toolbar.style.border =  '1px solid #b6b6b6';
        this.container.insertBefore(this.toolbar, this.container.childNodes[0]);

        this.dialog = document.createElement("div"); 
        this.dialog.style.position = 'fixed';
        this.dialog.style.zIndex = '10';
        this.dialog.style.width = '50%';
        this.dialog.style.top = '6vh';
        this.dialog.style.backgroundColor = '#fff';
        this.dialog.style.boxShadow = '0 1px 3px rgba(16,16,16,.3)';
        this.dialog.style.borderRadius = '2px';

        let dialog_header = document.createElement('div');
        dialog_header.style.padding = '15px 20px 8px';
        dialog_header.style.borderBottom = '1px solid #eee';
        dialog_header.innerHTML = 'md'
        

        let dialog_body = document.createElement('div');
        dialog_body.style.height = '450px';
        dialog_body.style.overflow = 'auto';
        dialog_body.style.padding = '5px 13px';
        let dialog_footer = document.createElement('div');
        dialog_footer.style.padding = '15px 20px 8px';
        let span = document.createElement('span');
        span.style.cursor = 'pointer';
        span.innerHTML = '关闭';
        span.onclick = () => {window.artText.headTool.dialog.style.display = 'none';};
        dialog_footer.appendChild(span);

        this.dialog.appendChild(dialog_header);
        this.dialog.appendChild(dialog_body);
        this.dialog.appendChild(dialog_footer);
        this.dialog.style.display = 'none';
        this.container.appendChild(this.dialog);
        this.addDefaultTool();
        addCss('.art-toolbar-span{padding:3px 5px;border:1px solid #e3e4e5; border-radius:2px}');
    }
    addDefaultTool(){
        this.addTool('md', 
        ()=>{let pre = document.createElement('pre');
        pre.appendChild(document.createTextNode(window.artText.interpreter.getMd()));
        window.artText.headTool.setDialog('MD',  pre)});
        
        this.addTool('保存本地', 
        ()=>{localStorage.md = window.artText.interpreter.getMd(); console.log('md保存成功')});

        this.addTool('本地载入', 
        ()=>{window.artText.interpreter.SetMd(localStorage.md); console.log('md载入成功')});
    }
    setDialog(header, body, footer=''){
        this.dialog.style.display = 'block';
        this.dialog.childNodes[0].innerHTML = header;
        this.dialog.childNodes[1].appendChild(body);
    }
    addTool(title, event){
        let span = document.createElement('span');
        span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.onclick = event;
        this.toolbar.appendChild(span);
    }
}
export default HeadTool