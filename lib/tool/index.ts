import floatAuxiliaryTool from './floatAuxiliaryTool'
import floatToolbar from './floatToolbar'
import {message} from './messageTool'
import ArtText from '../index';
import * as defaultFun from './default'
import {toolbarTool} from './toolbarTool'
import VersionHistory from './versionHistoryTool';

class Tool{
    static loadScript = defaultFun.loadScript;
    static loadCss = defaultFun.loadCss;
    static addCss = defaultFun.addCss;
    static hasClass = defaultFun.hasClass;
    static message: Function = null;

    artText: ArtText;
    container: HTMLHtmlElement;
    toolbar: HTMLDivElement;
    floatAuxiliaryTool: HTMLDivElement;
    floatToolbar: HTMLDivElement;
    versionHistory: VersionHistory;
    mdHtml: HTMLSpanElement;

    constructor(artText: ArtText, container: HTMLHtmlElement){
        this.artText = artText;
        this.container = container;

        this.versionHistory = new VersionHistory(artText);
        this.toolbar = null;
        this.floatAuxiliaryTool = null;
        this.floatToolbar = null;
        this.mdHtml = null;
        Tool.message = function(mes: string, type: string='null'){
            message(artText, mes, type);
        }
    }
    init(){
        this.toolbar = toolbarTool(this.artText.config.theme)
        this.container.insertBefore(this.toolbar, this.container.childNodes[0]);

        this.floatAuxiliaryTool = floatAuxiliaryTool();
        this.floatAuxiliaryTool.style.backgroundColor = this.artText.config.theme.get('backgroundColor');
        let floatAuxiliaryTool_li = '.art-floatAuxiliaryTool-li:hover{background-color: #f0f0f0;color:' + this.artText.config.theme.get('color') + '}';
        this.container.appendChild(this.floatAuxiliaryTool);

        this.floatToolbar = floatToolbar(this.artText);
        this.floatToolbar.style.backgroundColor = this.artText.config.theme.get('backgroundColor');
        let floatToolbar_span = '.art-floatToolbar-span{padding: 8px 10px;cursor: pointer;}.art-floatToolbar-span:hover{color:' + this.artText.config.theme.get('color') + '}';
        this.container.appendChild(this.floatToolbar);

        this.addDefaultTool();
        let toolbar_span = '.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}';
        Tool.addCss(css + toolbar_span + floatToolbar_span + floatAuxiliaryTool_li)
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
    private addDefaultTool(){
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
        this.addTool('历史', 
        ()=>{ this.versionHistory.open()});

        this.addTool('保存', 
        ()=>{
            let art_articles = JSON.parse(localStorage.art_articles);
            if(this.artText.editor.mdFileName && art_articles.hasOwnProperty(this.artText.editor.mdFileName)){
                // pass
            }else{
                let timestamp=new Date().getTime();
                let mdId = 'art_md_' + timestamp + '_';
                if(this.artText.editor.mdFileName){
                    mdId += this.artText.editor.mdFileName;
                }
                localStorage[mdId] = this.artText.editor.getMd();
                art_articles[mdId] = {ids: [mdId], time: timestamp, name: mdId}
                localStorage.art_articles = JSON.stringify(art_articles);
            }
            message(this.artText, 'md保存成功', 'success');
        });

        this.addTool('清空', 
        ()=>{this.artText.editor.emptyEditor(); message(this.artText, '清空成功', 'success');});
        this.addTool('<span style="position: absolute;right: 12px;color:#1abc9c" >ATTB</span>', () => {message(this.artText, '点击了一下');}, false)
    }
    addTool(title: string, event: Function, addDefaultCss: boolean=true): HTMLSpanElement{
        let span = document.createElement('span');
        if(addDefaultCss)
            span.setAttribute('class', 'art-toolbar-span')
        span.style.cursor = 'pointer';
        span.innerHTML = title;
        span.addEventListener('click', <EventListenerOrEventListenerObject>event);
        this.toolbar.appendChild(span);
        return span;
    }
}
let css = '.art-VersionHistory-selected{color: #1aba9c}\n\
.art-toc{border: 1px dashed #999;padding: 6px 15px;margin: 35px 0 15px;font-weight:500;}.art-toc p{margin-bottom: 2px}.art-toc a{border-bottom: none;color: #4183c4}.art-toc-h2{margin-left:2em}.art-toc-h3{margin-left:4em}.art-toc-h4{margin-left:6em}.art-toc-h5{margin-left:8em}.art-toc-h6{margin-left:10em}\n\
.art-flowTool{width:100%;text-align: center;}'
export default Tool