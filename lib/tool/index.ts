import floatAuxiliaryTool from './floatAuxiliaryTool'
import floatToolbar from './floatToolbar'
import {message} from './messageTool'
import ArtText from 'lib';
import * as defaultFun from './default'
import {toolbarTool} from './toolbarTool'

class Tool{
    static loadScript = defaultFun.loadScript;
    static loadCss = defaultFun.loadCss;
    static addCss = defaultFun.addCss;

    artText: ArtText;
    container: HTMLHtmlElement;
    toolbar: HTMLDivElement;
    floatAuxiliaryTool: HTMLHtmlElement;
    floatToolbar: HTMLDivElement;
    dialog: HTMLDivElement;
    mdHtml: HTMLSpanElement;

    constructor(artText: ArtText, container: HTMLHtmlElement){
        this.artText = artText;
        this.container = container;

        this.dialog = null;
        this.toolbar = null;
        this.floatAuxiliaryTool = null;
        this.floatToolbar = null;
        this.mdHtml = null;
    }
    init(){
        this.toolbar = toolbarTool(this.artText.config.theme)
        this.container.insertBefore(this.toolbar, this.container.childNodes[0]);

        this.floatAuxiliaryTool = floatAuxiliaryTool();
        this.floatAuxiliaryTool.style.backgroundColor = this.artText.config.theme.get('backgroundColor');
        Tool.addCss('.art-floatAuxiliaryTool-li:hover{background-color: #f0f0f0;color:' + this.artText.config.theme.get('color') + '}');
        this.container.appendChild(this.floatAuxiliaryTool);

        this.floatToolbar = floatToolbar();
        this.floatToolbar.style.backgroundColor = this.artText.config.theme.get('backgroundColor');
        Tool.addCss('.art-floatToolbar-span{padding: 8px 10px;cursor: pointer;}.art-floatToolbar-span:hover{color:' + this.artText.config.theme.get('color') + '}');
        this.container.appendChild(this.floatToolbar);

        this.addDefaultTool();
        Tool.addCss('.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}');

    }
    setFloatAuxiliaryTool(sel='hidden'){
        if(sel == 'hidden'){
            this.floatAuxiliaryTool.style.display = 'none';
            return false;
        }else{
            this.floatAuxiliaryTool.style.display = 'inline';
        }
        this.floatAuxiliaryTool.style.top = ((<any>event).pageY ).toString() + 'px';
        this.floatAuxiliaryTool.style.left = ((<any>event).pageX).toString() + 'px';
        //console.log(rect, rectFocus, event.pageY, event.pageX);
    }
    setFloatToolbar(sel='hidden'){
        if(sel == 'hidden'){
            this.floatToolbar.style.display = 'none';
            return false;
        }else{
            this.floatToolbar.style.display = 'inline';
        }
        console.log(event);
        console.log(this.artText.eventCenter.clickInfo);
        let pageXLenght  = (<any>event).pageX  - (this.artText.eventCenter.clickInfo['pageX'] );
        let pageYLenght  = (<any>event).pageY  - (this.artText.eventCenter.clickInfo['pageY'] );
        console.log(pageXLenght, pageYLenght)
        if(pageYLenght > 0){
            let event = this.artText.eventCenter.clickInfo;
            this.floatToolbar.style.top = ((<any>event).pageY - (<any>event).offsetY - 20).toString() + 'px';
            this.floatToolbar.style.left = ((<any>event).pageX + pageXLenght/2).toString() + 'px';
        }else{
            this.floatToolbar.style.top = ((<any>event).pageY - (<any>event).offsetY - 20).toString() + 'px';
            this.floatToolbar.style.left = ((<any>event).pageX + pageXLenght/2).toString() + 'px';
        }
        
    }
    addDefaultTool(){
        this.mdHtml = this.addTool('md', 
        ()=>{
            if(this.mdHtml.innerHTML == 'md'){
                this.mdHtml.innerHTML = 'html';
                this.artText.editor.openTextarea();
            }else{
                this.mdHtml.innerHTML = 'md';
                this.artText.editor.closeTextarea();
            }
        });
        
        this.addTool('保存本地', 
        ()=>{localStorage.md = this.artText.editor.getMd();message('md保存成功', 'success');});

        this.addTool('本地载入', 
        ()=>{this.artText.editor.setMd(localStorage.md); message('md载入成功', 'success');});
        this.addTool('清空', 
        ()=>{this.artText.editor.setMd(''); message('清空成功', 'success');});
        this.addTool('<span style="position: absolute;right: 12px;color:#1abc9c" >ATTB</span>', () => {message('点击了一下');})
    }
    setDialog(header, body, footer=''){
        footer;
        this.dialog.style.display = 'block';
        (<HTMLDivElement>this.dialog.childNodes[0]).innerHTML = header;
        this.dialog.childNodes[1].appendChild(body);
    }
    addTool(title: string, event: Function): HTMLSpanElement{
        let span = document.createElement('span');
        span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        this.toolbar.appendChild(span);
        return span;
    }
}

export default Tool