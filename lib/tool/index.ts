import floatAuxiliaryTool from './floatAuxiliaryTool'
import floatToolbar from './floatToolbar'
import {message} from './messageTool'
import ArtText from '../index';
import * as defaultFun from './default'
import {toolbarTool} from './toolbarTool'
import VersionHistory from './versionHistoryTool';
import { TableMoreTool} from './tableTool/tableMoreTool';

class Tool{
    static loadScript = defaultFun.loadScript;
    static loadCss = defaultFun.loadCss;
    static addCss = defaultFun.addCss;
    static hasClass = defaultFun.hasClass;
    static message: Function = null;

    artText: ArtText;
    rooDom: HTMLElement;
    toolbar: HTMLDivElement;
    floatAuxiliaryTool: HTMLDivElement;
    floatToolbar: HTMLDivElement;
    versionHistory: VersionHistory;
    mdHtml: HTMLSpanElement;
    tableMoreTool: TableMoreTool;

    constructor(artText: ArtText){
        this.artText = artText;

        this.versionHistory = new VersionHistory(artText);
        this.tableMoreTool = new TableMoreTool();
        this.toolbar = null;
        this.floatAuxiliaryTool = null;
        this.floatToolbar = null;
        this.mdHtml = null;
        Tool.message = function(mes: string, type: string='null'){
            message(artText, mes, type);
        }
    }
    init(){
        this.rooDom = this.artText.rootDom;
        this.toolbar = toolbarTool(this.artText.options.theme)
        this.rooDom.insertBefore(this.toolbar, this.rooDom.childNodes[0]);

        this.floatAuxiliaryTool = floatAuxiliaryTool();
        this.floatAuxiliaryTool.style.backgroundColor = this.artText.options.theme.backgroundColor;
        let floatAuxiliaryTool_li = '.art-floatAuxiliaryTool-li:hover{background-color: #f0f0f0;color:' + this.artText.options.theme.color + '}';
        this.rooDom.appendChild(this.floatAuxiliaryTool);

        this.floatToolbar = floatToolbar(this.artText);
        this.floatToolbar.style.backgroundColor = this.artText.options.theme.backgroundColor;
        let floatToolbar_span = '.art-floatToolbar-span{padding: 8px 10px;cursor: pointer;}.art-floatToolbar-span:hover{color:' + this.artText.options.theme.color + '}';
        this.rooDom.appendChild(this.floatToolbar);

        this.rooDom.appendChild(this.tableMoreTool.createDom());

        this.addDefaultTool();
        let toolbar_span = '.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}';
        Tool.addCss(css + toolbar_span + floatToolbar_span + floatAuxiliaryTool_li)
    }
    setFloatAuxiliaryTool(flag){
        if(flag == 'hide'){
            this.floatAuxiliaryTool.style.display = 'none';
            return false;
        }else{
            this.floatAuxiliaryTool.style.display = 'inline';
        }
        this.floatAuxiliaryTool.style.top = ((<any>event).pageY ).toString() + 'px';
        this.floatAuxiliaryTool.style.left = ((<any>event).pageX).toString() + 'px';
        //console.log(rect, rectFocus, event.pageY, event.pageX);
    }
    setFloatToolbar(flag){
        if(flag == 'hide'){
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

        this.addTool('新建', 
        ()=>{this.artText.editor.emptyEditor();});

        this.addTool('历史', 
        ()=>{ this.versionHistory.open()});

        this.addTool('保存', 
        ()=>{
            let art_articles = JSON.parse(localStorage.art_articles);
            if(this.artText.editor.fileInfo['id'] && art_articles.hasOwnProperty(this.artText.editor.fileInfo['id'])){
                localStorage[this.artText.editor.fileInfo['id']] = this.artText.editor.getMd();
                art_articles[this.artText.editor.fileInfo['id']] = this.artText.editor.fileInfo;
                localStorage.art_articles = JSON.stringify(art_articles);
                Tool.message('md保存成功', 'success');
            }else{
                let timestamp=new Date().getTime();
                let mdId = 'art_md_' + timestamp + '_';
                let name = mdId;
                if(this.artText.editor.fileInfo['name']){
                    mdId += this.artText.editor.fileInfo['name'];
                    name = this.artText.editor.fileInfo['name'];
                }
                localStorage[mdId] = this.artText.editor.getMd();
                art_articles[mdId] = {ids: [mdId], time: timestamp, name: name, id: mdId}
                localStorage.art_articles = JSON.stringify(art_articles);
                this.artText.editor.fileInfo = art_articles[mdId];
                message(this.artText, 'md保存成功', 'success');
            }
            // message(this.artText, 'md保存成功', 'success');
        });

        this.addTool('<span style="position: absolute;right: 12px;color:#1abc9c" title="项目地址">Github</span>', () => {window.open('https://github.com/liziqiang9/ArtText');}, false)
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
.art-toc{padding: 6px 15px;margin: 0 0 15px;font-weight:500;border: 1px dashed #9990;}.art-toc p{margin-bottom: 2px}.art-toc a{border-bottom: none;color: #4183c4}.art-toc-h2{margin-left:2em}.art-toc-h3{margin-left:4em}.art-toc-h4{margin-left:6em}.art-toc-h5{margin-left:8em}.art-toc-h6{margin-left:10em}\n\
.art-flowTool{width:100%;text-align: center;}\n\
.art-tableTool-button{font-size:13px;font-weight:600;margin-left:4px;cursor:pointer;border: none;outline: none;padding: 0px 4px;border: 1px solid #9a9a9a00;background:#fff;}.art-tableTool-button:hover{border-color:#aaaa;background:#efefef;}\n\
.art-tableTool-more{width:180px;list-style: none;position: fixed;top: 10px;left: 10px;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;background:#fff;font-size: 14px;padding:8px 0 6px}.art-tableTool-more-li{padding: 4px 25px;cursor: pointer;}.art-tableTool-more li:hover{background-color: #f0f0f0;}.art-divider{margin: 4px 0;background: #e5e5e5;padding: 1px 0 0;}'
export default Tool