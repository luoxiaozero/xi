import {addCss} from '../index'
import floatAuxiliaryTool from '../floatAuxiliaryTool'
import {message} from '../messageTool'
class Tool{
    constructor(container, artText){
        this.artText = artText;
        this.container = container;
        this.dialog = null;
        this.toolbar = null;
        this.floatAuxiliaryTool = null;
        this.mdHtml = null;
    }
    init(){
        this.toolbar = document.createElement("div"); 
        this.toolbar.style.marginBottom = '25px';
        this.toolbar.style.padding = '10px 12px';
        this.toolbar.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
        this.toolbar.style.backgroundColor = this.artText.config.theme.backgroundColor;
        this.toolbar.setAttribute('class', 'art-toolbar');
        addCss('.art-toolbar{color: #666; font-weight:600; font-size:13.5px; border-radius: 4px; position: relative;}');
        this.container.insertBefore(this.toolbar, this.container.childNodes[0]);

        this.floatAuxiliaryTool = floatAuxiliaryTool();
        this.floatAuxiliaryTool.style.backgroundColor = this.artText.config.theme.backgroundColor;
        addCss('.art-floatAuxiliaryTool-li:hover{background-color: #f0f0f0;color:' + this.artText.config.theme.color + '}');
        this.container.appendChild(this.floatAuxiliaryTool);

        this.dialog = document.createElement("div"); 
        this.dialog.style.position = 'fixed';
        this.dialog.style.zIndex = '10';
        this.dialog.style.width = '50%';
        this.dialog.style.top = '6vh';
        this.dialog.style.backgroundColor = '#fff';
        this.dialog.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
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
        span.onclick = () => {window.artText.tool.dialog.style.display = 'none';};
        dialog_footer.appendChild(span);

        this.dialog.appendChild(dialog_header);
        this.dialog.appendChild(dialog_body);
        this.dialog.appendChild(dialog_footer);
        this.dialog.style.display = 'none';
        this.container.appendChild(this.dialog);
        this.addDefaultTool();
        addCss('.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}');

    }
    setFloatAuxiliaryTool(sel='hidden'){
        if(sel == 'hidden'){
            this.floatAuxiliaryTool.style.display = 'none';
            return false;
        }else{
            this.floatAuxiliaryTool.style.display = 'inline';
        }
        let {anchorNode, anchorOffset, focusNode, focusOffset} = sel;
        let dom = anchorNode;
        //console.log(dom);
        //console.log(event);
        //dom.parentNode;
        let rect, rectFocus;
        if(dom.nodeName == '#text')
            rect = dom.parentNode.getBoundingClientRect();
        else
            rect = dom.getBoundingClientRect(); 
            
        if(focusNode.nodeName == '#text')
            rectFocus = focusNode.parentNode.getBoundingClientRect();
        else
            rectFocus = focusNode.getBoundingClientRect();
        
        this.floatAuxiliaryTool.style.top = (event.pageY ).toString() + 'px';
        this.floatAuxiliaryTool.style.left = (event.pageX).toString() + 'px';
        //console.log(rect, rectFocus, event.pageY, event.pageX);
    }
    addDefaultTool(){
        this.mdHtml = this.addTool('md', 
        ()=>{
            if(this.mdHtml.innerHTML == 'md'){
                this.mdHtml.innerHTML = 'html';
                window.artText.interpreter.openTextarea();
            }else{
                this.mdHtml.innerHTML = 'md';
                window.artText.interpreter.closeTextarea();
            }
        });
        
        this.addTool('保存本地', 
        ()=>{localStorage.md = window.artText.interpreter.getMd();message('md保存成功', 'success');});

        this.addTool('本地载入', 
        ()=>{window.artText.interpreter.setMd(localStorage.md); message('md载入成功', 'success');});
        this.addTool('清空', 
        ()=>{window.artText.interpreter.setMd(''); message('清空成功', 'success');});
        this.addTool('<span style="position: absolute;right: 12px;color:#1abc9c" >ATTB</span>', () => {})
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
        return span;
    }
}
export default Tool