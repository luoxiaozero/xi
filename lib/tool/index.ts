import {message} from './messageTool'
import ArtText from '../index';
import * as defaultFun from './default'
import ToolbarTool from './toolbarTool'
import { TableMoreTool} from '../render/artRender/tool/tableTool/tableMoreTool';


class Tool{
    static loadScript = defaultFun.loadScript;
    static loadCss = defaultFun.loadCss;
    static addCss = defaultFun.addCss;
    static hasClass = defaultFun.hasClass;
    static plugins = { ToolbarTool };
    static message: Function = null;
    static DEFAULT_CSS = '\n\
    .art-toolbar{background-color: #fff;color: #666; font-weight:600; font-size:13.5px; border-radius: 4px; position: relative;box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);margin-bottom:25px;padding:13px 12px}.art-toolbar-span{padding:5px 5px;margin-right: 9px} .art-toolbar-span:hover{color:#1abc9c;}\n\
    .art-floatTool{width:180px;list-style: none;position: fixed;top: 10px;left: 10px;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;background:#fff;font-size: 14px;padding:8px 0 6px}.art-floatTool-li{padding: 6px 25px;cursor: pointer;}.art-floatTool li:hover{background-color: #f4f4f4; color: ${theme.color}}.art-divider{margin: 4px 0;background: #e5e5e5;padding: 1px 0 0;}'
    artText: ArtText;
    toolbar: ToolbarTool;
    floatToolbar: HTMLDivElement;
    tableMoreTool: TableMoreTool;

    constructor(artText: ArtText){
        this.artText = artText;

        //this.versionHistory = new VersionHistory(artText);
        this.tableMoreTool = new TableMoreTool();
        this.toolbar = new ToolbarTool();

        this.artText.rootDom.insertBefore(this.toolbar.createDom(), this.artText.rootDom.childNodes[0]);
        
        Tool.message = function(mes: string, type: string='null'){
            message(artText, mes, type);
        }
    }

    addTool(dom: HTMLElement){
        this.artText.rootDom.appendChild(dom);
    }
}
export default Tool